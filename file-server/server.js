
const express = require('express');
const session = require('express-session');
const compression = require('compression');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_PATH = path.join(__dirname, 'data', 'secure.db');

// 确保必要的目录存在
fs.ensureDirSync(BASE_UPLOAD_DIR);
fs.ensureDirSync(path.dirname(DB_PATH));

// 初始化 SQLite 数据库（使用文件权限保护）
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// 创建用户表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// 设置数据库文件权限（仅当前用户可读写）
try {
  fs.chmodSync(DB_PATH, 0o600);
  const dbWalPath = DB_PATH + '-wal';
  if (fs.existsSync(dbWalPath)) fs.chmodSync(dbWalPath, 0o600);
} catch (err) {
  console.warn('无法设置数据库文件权限:', err);
}

// 配置 Express
app.use(compression({ level: 4, threshold: 512 }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// 内存session存储（更快）
const MemoryStore = require('memorystore')(session);
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: 86400000 }),
  cookie: { secure: false, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// 辅助函数：获取文件类型
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  const typeMap = {
    'jpg': '图片', 'jpeg': '图片', 'png': '图片', 'gif': '图片', 'bmp': '图片', 'webp': '图片', 'svg': '图片',
    'mp4': '视频', 'avi': '视频', 'mov': '视频', 'wmv': '视频', 'flv': '视频', 'mkv': '视频',
    'mp3': '音频', 'wav': '音频', 'flac': '音频', 'aac': '音频', 'ogg': '音频',
    'pdf': '文档', 'doc': '文档', 'docx': '文档', 'xls': '文档', 'xlsx': '文档', 'ppt': '文档', 'pptx': '文档', 'txt': '文档',
    'zip': '压缩包', 'rar': '压缩包', '7z': '压缩包', 'tar': '压缩包', 'gz': '压缩包',
    'js': '代码', 'html': '代码', 'css': '代码', 'py': '代码', 'java': '代码', 'c': '代码', 'cpp': '代码', 'json': '代码'
  };
  return typeMap[ext] || '其他';
}

// 缓存：文件列表
const fileCache = new Map();
const CACHE_TTL = 5000; // 5秒缓存

// 缓存：静态资源（favicon）
let faviconCache = null;

function getFileListCacheKey(dirPath) {
  return dirPath || '__root__';
}

// 清除缓存（上传/删除/移动后调用）
function invalidateCache(dirPath) {
  const key = getFileListCacheKey(dirPath);
  fileCache.delete(key);
}

// 辅助函数：获取目录内容（带缓存）
function getDirectoryContents(dirPath) {
  const cacheKey = getFileListCacheKey(dirPath);
  const cached = fileCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.items;
  }
  
  const fullPath = path.join(BASE_UPLOAD_DIR, dirPath);
  const items = [];
  
  try {
    if (!fs.existsSync(fullPath)) return items;
    
    const files = fs.readdirSync(fullPath);
    
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      try {
        const stats = fs.statSync(filePath);
        const relativePath = path.join(dirPath, file);
        
        items.push({
          name: file,
          path: relativePath,
          type: stats.isDirectory() ? 'folder' : 'file',
          size: stats.size,
          fileType: stats.isDirectory() ? '' : getFileType(file),
          uploaded: new Date(stats.mtime).toLocaleString('zh-CN')
        });
      } catch (e) {
        // 跳过无法访问的文件
      }
    }
  } catch (err) {
    console.error('读取目录内容失败:', err);
  }
  
  items.sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });
  
  fileCache.set(cacheKey, { items, time: Date.now() });
  return items;
}

// 缓存：文件夹列表
let folderListCache = { folders: null, time: 0 };

// 辅助函数：获取所有文件夹列表（带缓存）
function getAllFolders(dir = '', folders = [], useCache = true) {
  if (useCache && dir === '' && folderListCache.folders && Date.now() - folderListCache.time < CACHE_TTL) {
    return folderListCache.folders;
  }
  
  const fullPath = path.join(BASE_UPLOAD_DIR, dir);
  
  try {
    if (!fs.existsSync(fullPath)) return folders;
    
    const files = fs.readdirSync(fullPath);
    
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      try {
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          const relativePath = path.join(dir, file);
          folders.push(relativePath);
          getAllFolders(relativePath, folders, false);
        }
      } catch (e) {
        // 跳过
      }
    }
  } catch (err) {
    console.error('获取文件夹列表失败:', err);
  }
  
  if (dir === '') {
    folderListCache = { folders, time: Date.now() };
  }
  return folders;
}

// 配置 multer 存储（动态路径）
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.body.uploadPath || '';
    const fullPath = path.join(BASE_UPLOAD_DIR, uploadPath);
    fs.ensureDirSync(fullPath);
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // 保留原始文件名（支持中文），加上时间戳避免覆盖
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const timestamp = Date.now();
    cb(null, baseName + '-' + timestamp + ext);
  }
});
const upload = multer({ storage: storage });

// 中间件：检查是否已登录
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Favicon 路由（简单的 SVG 图标，带缓存）
app.get('/favicon.ico', (req, res) => {
  if (faviconCache) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(faviconCache);
  }
  
  faviconCache = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#667eea" rx="20"/>
    <text x="50" y="65" font-size="50" text-anchor="middle" fill="white" font-family="Arial, sans-serif">🐮</text>
  </svg>`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(faviconCache);
});

// 路由：登录页面
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>小牛网盘 - 登录</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.ico">
      <style>
        * { margin:0;padding:0;box-sizing:border-box; }
        body {
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background: url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
          position: relative;
          padding:20px;
        }
        body::before {
          content: '';
          position: absolute;
          top:0;left:0;right:0;bottom:0;
          background: linear-gradient(135deg, rgba(102,126,234,0.7) 0%, rgba(118,75,162,0.7) 100%);
        }
        .container {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius:20px;
          padding:40px;
          box-shadow:0 8px 32px 0 rgba(31,38,135,0.37);
          border:1px solid rgba(255,255,255,0.18);
          width:100%;
          max-width:420px;
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo-icon {
          font-size: 60px;
          margin-bottom: 10px;
        }
        h1 { 
          color:white;
          text-align:center;
          margin-bottom:10px;
          font-weight:300;
          font-size: 28px;
        }
        .subtitle {
          color: rgba(255,255,255,0.8);
          text-align: center;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .form-group { margin-bottom:20px; }
        label { display:block;color:rgba(255,255,255,0.9);margin-bottom:8px;font-size:14px; }
        input {
          width:100%;
          padding:14px 16px;
          border:none;
          border-radius:12px;
          background:rgba(255,255,255,0.15);
          color:white;
          font-size:16px;
          outline:none;
        }
        input::placeholder { color:rgba(255,255,255,0.5); }
        button {
          width:100%;
          padding:14px;
          border:none;
          border-radius:12px;
          background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
          color:white;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
          transition:transform 0.2s;
        }
        button:hover { transform:translateY(-2px); }
        .link {
          text-align:center;
          margin-top:25px;
          color:rgba(255,255,255,0.8);
          font-size:14px;
        }
        .link a { color:white;text-decoration:none;font-weight:600;border-bottom:1px solid transparent; }
        .link a:hover { border-bottom-color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <div class="logo-icon">🐮</div>
        </div>
        <h1>小牛网盘</h1>
        <p class="subtitle">安全、便捷的文件存储服务</p>
        <form method="POST" action="/login">
          <div class="form-group">
            <label>用户名</label>
            <input type="text" name="username" required placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" name="password" required placeholder="请输入密码">
          </div>
          <button type="submit">登录</button>
        </form>
        <div class="link">
          还没有账号？<a href="/register">立即注册</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 路由：注册页面
app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>小牛网盘 - 注册</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.ico">
      <style>
        * { margin:0;padding:0;box-sizing:border-box; }
        body {
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background: url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
          position: relative;
          padding:20px;
        }
        body::before {
          content: '';
          position: absolute;
          top:0;left:0;right:0;bottom:0;
          background: linear-gradient(135deg, rgba(40,167,69,0.7) 0%, rgba(32,201,151,0.7) 100%);
        }
        .container {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius:20px;
          padding:40px;
          box-shadow:0 8px 32px 0 rgba(31,38,135,0.37);
          border:1px solid rgba(255,255,255,0.18);
          width:100%;
          max-width:420px;
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo-icon {
          font-size: 60px;
          margin-bottom: 10px;
        }
        h1 { 
          color:white;
          text-align:center;
          margin-bottom:10px;
          font-weight:300;
          font-size: 28px;
        }
        .subtitle {
          color: rgba(255,255,255,0.8);
          text-align: center;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .form-group { margin-bottom:20px; }
        label { display:block;color:rgba(255,255,255,0.9);margin-bottom:8px;font-size:14px; }
        input {
          width:100%;
          padding:14px 16px;
          border:none;
          border-radius:12px;
          background:rgba(255,255,255,0.15);
          color:white;
          font-size:16px;
          outline:none;
        }
        input::placeholder { color:rgba(255,255,255,0.5); }
        small { color:rgba(255,255,255,0.7);font-size:12px;margin-top:5px;display:block; }
        button {
          width:100%;
          padding:14px;
          border:none;
          border-radius:12px;
          background:linear-gradient(135deg,#28a745 0%,#20c997 100%);
          color:white;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
          transition:transform 0.2s;
        }
        button:hover { transform:translateY(-2px); }
        .link {
          text-align:center;
          margin-top:25px;
          color:rgba(255,255,255,0.8);
          font-size:14px;
        }
        .link a { color:white;text-decoration:none;font-weight:600;border-bottom:1px solid transparent; }
        .link a:hover { border-bottom-color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <div class="logo-icon">🐮</div>
        </div>
        <h1>小牛网盘</h1>
        <p class="subtitle">加入我们，开始您的文件之旅</p>
        <form method="POST" action="/register">
          <div class="form-group">
            <label>用户名</label>
            <input type="text" name="username" required placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" name="password" required placeholder="请输入密码（至少6位）" minlength="6">
            <small>密码长度至少需要6位</small>
          </div>
          <button type="submit">注册</button>
        </form>
        <div class="link">
          已有账号？<a href="/login">立即登录</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 路由：处理注册
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (password.length < 6) {
    return res.send('<h1 style="text-align:center;margin-top:100px;color:#667eea;">密码长度至少需要6位，请<a href="/register">返回注册</a></h1>');
  }
  
  try {
    const checkStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    const existingUser = checkStmt.get(username);
    
    if (existingUser) {
      return res.send('<h1 style="text-align:center;margin-top:100px;color:#667eea;">该用户名已被注册，请<a href="/register">返回注册</a></h1>');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashedPassword);
    res.redirect('/login');
  } catch (err) {
    console.error('注册失败:', err);
    res.send('<h1 style="text-align:center;margin-top:100px;color:#667eea;">注册失败，请<a href="/register">重试</a></h1>');
  }
});

// 路由：处理登录
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username);
    
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      res.redirect('/');
    } else {
      res.send('<h1 style="text-align:center;margin-top:100px;color:#667eea;">用户名或密码错误，请<a href="/login">重试</a></h1>');
    }
  } catch (err) {
    console.error('登录失败:', err);
    res.send('<h1 style="text-align:center;margin-top:100px;color:#667eea;">登录失败，请<a href="/login">重试</a></h1>');
  }
});

// API：创建文件夹
app.post('/api/folders', requireAuth, (req, res) => {
  try {
    const { folderPath, folderName } = req.body;
    if (!folderName || !folderName.trim()) {
      return res.status(400).json({ error: '文件夹名称不能为空' });
    }
    
    const fullPath = path.join(BASE_UPLOAD_DIR, folderPath || '', folderName.trim());
    if (fs.existsSync(fullPath)) {
      return res.status(400).json({ error: '文件夹已存在' });
    }
    
    fs.ensureDirSync(fullPath);
    invalidateCache(folderPath || '');
    folderListCache = { folders: null, time: 0 };
    res.json({ success: true, path: path.join(folderPath || '', folderName.trim()) });
  } catch (err) {
    console.error('创建文件夹失败:', err);
    res.status(500).json({ error: '创建文件夹失败' });
  }
});

// API：删除文件
app.delete('/api/files', requireAuth, (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: '文件路径不能为空' });
    }
    
    const fullPath = path.join(BASE_UPLOAD_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    fs.removeSync(fullPath);
    invalidateCache(path.dirname(filePath));
    res.json({ success: true });
  } catch (err) {
    console.error('删除文件失败:', err);
    res.status(500).json({ error: '删除文件失败' });
  }
});

// API：删除文件夹
app.delete('/api/folders', requireAuth, (req, res) => {
  try {
    const { folderPath } = req.body;
    if (!folderPath) {
      return res.status(400).json({ error: '文件夹路径不能为空' });
    }
    
    const fullPath = path.join(BASE_UPLOAD_DIR, folderPath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: '文件夹不存在' });
    }
    
    fs.removeSync(fullPath);
    invalidateCache(path.dirname(folderPath));
    folderListCache = { folders: null, time: 0 };
    res.json({ success: true });
  } catch (err) {
    console.error('删除文件夹失败:', err);
    res.status(500).json({ error: '删除文件夹失败' });
  }
});

// API：移动文件
app.post('/api/move', requireAuth, (req, res) => {
  try {
    const { sourcePath, targetPath } = req.body;
    if (!sourcePath || targetPath === undefined || targetPath === null) {
      return res.status(400).json({ error: '源路径和目标路径不能为空' });
    }
    
    const sourceFullPath = path.join(BASE_UPLOAD_DIR, sourcePath);
    const targetFullPath = path.join(BASE_UPLOAD_DIR, targetPath, path.basename(sourcePath));
    
    if (!fs.existsSync(sourceFullPath)) {
      return res.status(404).json({ error: '源文件不存在' });
    }
    
    if (fs.existsSync(targetFullPath)) {
      return res.status(400).json({ error: '目标位置已存在同名文件' });
    }
    
    fs.moveSync(sourceFullPath, targetFullPath);
    invalidateCache(path.dirname(sourcePath));
    invalidateCache(targetPath);
    res.json({ success: true });
  } catch (err) {
    console.error('移动文件失败:', err);
    res.status(500).json({ error: '移动文件失败' });
  }
});

// 路由：主页（需要登录）
app.get('/', requireAuth, (req, res) => {
  try {
    const currentPath = req.query.path || '';
    const items = getDirectoryContents(currentPath);
    const allFolders = ['', ...getAllFolders()];
    
    // 构建面包屑
    const breadcrumbs = [];
    if (currentPath) {
      const parts = currentPath.split(path.sep);
      let accumulated = '';
      breadcrumbs.push({ name: '根目录', path: '' });
      parts.forEach((part, index) => {
        accumulated = path.join(accumulated, part);
        breadcrumbs.push({ name: part, path: accumulated });
      });
    }
    
    // 生成面包屑 HTML
    let breadcrumbHtml = '';
    if (breadcrumbs.length === 0) {
      breadcrumbHtml = '<span class="breadcrumb-item">根目录</span>';
    } else {
      breadcrumbHtml = breadcrumbs.map((item, i) => {
        let html = '';
        if (i > 0) {
          html += '<span class="breadcrumb-separator">/</span>';
        }
        html += '<a href="?path=' + encodeURIComponent(item.path) + '" class="breadcrumb-item">' + item.name + '</a>';
        return html;
      }).join('');
    }
    
    // 生成上传路径选择 HTML
    let pathSelectOptions = '<option value="">根目录</option>';
    allFolders.filter(f => f).forEach(f => {
      pathSelectOptions += '<option value="' + f + '">/' + f + '</option>';
    });
    
    // 生成文件列表 HTML
    let fileListHtml = '';
    if (items.length === 0) {
      fileListHtml = '<li class="empty">暂无文件，快去上传吧！</li>';
    } else {
      items.forEach(item => {
        let typeTag = '';
        let metaInfo = '';
        let icon = item.type === 'folder' ? '📁 ' : '📄 ';
        let nameSuffix = item.type === 'folder' ? '/' : '';
        
        if (item.type === 'folder') {
          typeTag = '<span class="folder-tag">文件夹</span>';
          metaInfo = typeTag + ' ' + item.uploaded;
        } else {
          typeTag = '<span class="type-tag">' + item.fileType + '</span>';
          metaInfo = typeTag + ' (' + (item.size / 1024).toFixed(2) + ' KB) - ' + item.uploaded;
        }
        
        let actionsHtml = '';
        if (item.type === 'file') {
          actionsHtml += '<button class="action-small download" onclick="event.stopPropagation();window.location.href=\'/download/' + encodeURIComponent(item.path) + '\'">下载</button>';
        }
        actionsHtml += '<button class="action-small move" onclick="event.stopPropagation();showMoveModal(\'' + item.path + '\',\'' + item.type + '\',\'' + item.name + '\')">移动</button>';
        actionsHtml += '<button class="action-small delete" onclick="event.stopPropagation();deleteItem(\'' + item.path + '\',\'' + item.type + '\',\'' + item.name + '\')">删除</button>';
        
        fileListHtml += `
          <li class="file-item" data-name="${item.name.toLowerCase()}" data-type="${item.type === 'folder' ? 'folder' : item.fileType}">
            <div class="file-info" onclick="navigateTo('${encodeURIComponent(item.path)}','${item.type}')">
              <span class="file-name">${icon}${item.name}${nameSuffix}</span>
              <span class="file-meta">${metaInfo}</span>
            </div>
            <div class="actions">${actionsHtml}</div>
          </li>
        `;
      });
    }
    
    res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>小牛网盘 - 文件管理</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.ico">
      <style>
        * { margin:0;padding:0;box-sizing:border-box; }
        body {
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
          min-height:100vh;
          background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
          overflow:hidden;
        }
        .app { display:flex;height:100vh;padding:20px;gap:20px; }
        /* 左侧 */
        .left {
          width:400px;flex-shrink:0;display:flex;flex-direction:column;gap:20px;
        }
        .header {
          background:rgba(255,255,255,0.25);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-radius:20px;
          padding:20px;
          box-shadow:0 8px 32px 0 rgba(31,38,135,0.37);
          border:1px solid rgba(255,255,255,0.18);
          display:flex;justify-content:space-between;align-items:center;
        }
        .header h1 { color:white;font-weight:400;font-size:20px; }
        .logout {
          padding:8px 16px;border:none;border-radius:10px;background:rgba(255,255,255,0.2);
          color:white;font-size:14px;text-decoration:none;
        }
        .upload-card {
          background:rgba(255,255,255,0.25);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-radius:20px;
          padding:25px;
          box-shadow:0 8px 32px 0 rgba(31,38,135,0.37);
          border:1px solid rgba(255,255,255,0.18);
          flex:1;display:flex;flex-direction:column;
        }
        .upload-card h2 { color:white;font-weight:400;margin-bottom:15px;font-size:18px; }
        .path-section { margin-bottom:15px; }
        .path-section label { color:rgba(255,255,255,0.9);font-size:14px;display:block;margin-bottom:8px; }
        .path-controls { display:flex;gap:10px;margin-bottom:10px; }
        .path-select {
          flex:1;padding:10px 12px;border:none;border-radius:10px;
          background:rgba(255,255,255,0.15);color:#333;font-size:14px;
        }
        .new-folder {
          padding:10px 15px;border:none;border-radius:10px;
          background:linear-gradient(135deg,#28a745 0%,#20c997 100%);
          color:white;font-size:14px;cursor:pointer;white-space:nowrap;
        }
        .upload-area {
          border:2px dashed rgba(255,255,255,0.5);
          border-radius:12px;padding:25px 20px;text-align:center;
          margin-bottom:15px;cursor:pointer;
        }
        .upload-area:hover { border-color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.1); }
        .upload-icon { font-size:40px;margin-bottom:10px; }
        .upload-text { color:white;font-size:14px;margin-bottom:10px; }
        .file-input { display:none; }
        .upload-btn {
          width:100%;padding:12px;border:none;border-radius:12px;
          background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
          color:white;font-size:16px;font-weight:600;cursor:pointer;
          transition:transform 0.2s;margin-top:auto;
        }
        .upload-btn:hover { transform:translateY(-2px); }
        .upload-btn:disabled { opacity:0.5;cursor:not-allowed;transform:none; }
        
        /* 上传进度条 */
        .progress-container { margin-top:15px; }
        .progress-item { background:rgba(255,255,255,0.1);border-radius:10px;padding:12px;margin-bottom:10px; }
        .progress-item-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:8px; }
        .progress-item-name { color:white;font-size:13px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .progress-item-percent { color:#20c997;font-size:12px;font-weight:500; }
        .progress-bar-bg { height:8px;background:rgba(255,255,255,0.2);border-radius:4px;overflow:hidden; }
        .progress-bar-fill { height:100%;background:linear-gradient(90deg,#667eea 0%,#20c997 100%);border-radius:4px;transition:width 0.3s; }
        .progress-actions { display:flex;gap:8px;margin-top:8px; }
        .progress-btn { padding:4px 12px;border:none;border-radius:6px;font-size:11px;cursor:pointer; }
        .progress-btn-pause { background:rgba(255,193,7,0.2);color:#ffc107; }
        .progress-btn-resume { background:rgba(32,201,151,0.2);color:#20c997; }
        .progress-btn-cancel { background:rgba(220,53,69,0.2);color:#dc3545; }
        .selected { flex:1;overflow-y:auto;margin-top:15px; }
        .selected h3 { color:white;font-weight:400;margin-bottom:12px;font-size:16px; }
        .selected-list { list-style:none; }
        .selected-item {
          background:rgba(255,255,255,0.15);border-radius:10px;padding:12px;
          margin-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start;
        }
        .selected-info { flex:1;margin-right:10px; }
        .selected-name { color:white;font-weight:500;font-size:14px;margin-bottom:4px;word-break:break-all; }
        .selected-meta { color:rgba(255,255,255,0.7);font-size:12px; }
        .remove-btn {
          padding:4px 10px;border:none;border-radius:6px;background:rgba(220,53,69,0.6);
          color:white;font-size:12px;cursor:pointer;flex-shrink:0;
        }
        /* 右侧 */
        .right {
          flex:1;background:rgba(255,255,255,0.25);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-radius:20px;
          padding:25px;
          box-shadow:0 8px 32px 0 rgba(31,38,135,0.37);
          border:1px solid rgba(255,255,255,0.18);
          display:flex;flex-direction:column;
        }
        .path-bar {
          display:flex;align-items:center;gap:10px;margin-bottom:15px;flex-wrap:wrap;
        }
        .breadcrumb {
          display:flex;align-items:center;gap:8px;flex-wrap:wrap;
        }
        .breadcrumb-item {
          color:white;text-decoration:none;padding:6px 12px;border-radius:8px;
          background:rgba(255,255,255,0.15);font-size:14px;
        }
        .breadcrumb-item:hover { background:rgba(255,255,255,0.25); }
        .breadcrumb-separator { color:rgba(255,255,255,0.5); }
        .right-actions {
          display:flex;gap:10px;margin-left:auto;
        }
        .action-btn {
          padding:10px 16px;border:none;border-radius:10px;
          background:rgba(255,255,255,0.2);color:white;font-size:14px;cursor:pointer;
        }
        .action-btn:hover { background:rgba(255,255,255,0.3); }
        .right-header { display:flex;gap:15px;margin-bottom:15px;flex-wrap:wrap; }
        .search {
          flex:1;min-width:200px;padding:12px 16px;border:none;border-radius:12px;
          background:rgba(255,255,255,0.15);color:white;font-size:14px;
        }
        .search::placeholder { color:rgba(255,255,255,0.5); }
        .filter {
          padding:12px 16px;border:none;border-radius:12px;
          background:rgba(255,255,255,0.15);color:#333;font-size:14px;
        }
        .files { flex:1;overflow-y:auto; }
        .files h2 { color:white;font-weight:400;margin-bottom:15px;font-size:18px; }
        .file-list { list-style:none; }
        .file-item {
          background:rgba(255,255,255,0.15);border-radius:12px;padding:15px 20px;
          margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;
        }
        .file-item:hover { background:rgba(255,255,255,0.25); }
        .file-info { color:white;flex:1;margin-right:15px;cursor:pointer; }
        .file-name { font-weight:500;display:block;margin-bottom:4px;word-break:break-all; }
        .file-meta { font-size:12px;opacity:0.8; }
        .type-tag {
          display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;
          margin-right:8px;background:rgba(255,255,255,0.2);color:#333;
        }
        .folder-tag {
          display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;
          margin-right:8px;background:rgba(255,193,7,0.3);color:#333;
        }
        .actions { display:flex;gap:8px;flex-shrink:0; }
        .action-small {
          padding:6px 12px;border:none;border-radius:6px;font-size:13px;cursor:pointer;
        }
        .download {
          background:rgba(255,255,255,0.2);color:white;
        }
        .move {
          background:rgba(255,193,7,0.4);color:#333;
        }
        .delete {
          background:rgba(220,53,69,0.6);color:white;
        }
        .empty { color:rgba(255,255,255,0.7);text-align:center;padding:40px; }
        /* 弹窗 */
        .modal-overlay {
          position:fixed;top:0;left:0;right:0;bottom:0;
          background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;
        }
        .modal {
          background:rgba(255,255,255,0.25);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-radius:20px;padding:30px;box-shadow:0 8px 32px 0 rgba(31,38,135,0.37);
          border:1px solid rgba(255,255,255,0.18);max-width:450px;width:90%;
        }
        .modal h3 { color:white;margin-bottom:15px;font-weight:400; }
        .modal p { color:rgba(255,255,255,0.9);margin-bottom:20px; }
        .modal select, .modal input {
          width:100%;padding:12px 16px;border:none;border-radius:12px;
          background:rgba(255,255,255,0.15);color:#333;font-size:14px;
          outline:none;margin-bottom:20px;
        }
        .modal input::placeholder { color:rgba(0,0,0,0.5); }
        .modal-btns { display:flex;gap:10px;justify-content:flex-end; }
        .modal-btn { padding:10px 20px;border:none;border-radius:10px;font-size:14px;cursor:pointer; }
        .modal-btn-cancel { background:rgba(255,255,255,0.2);color:white; }
        .modal-btn-confirm { background:linear-gradient(135deg,#dc3545 0%,#c82333 100%);color:white; }
        .modal-btn-success { background:linear-gradient(135deg,#28a745 0%,#20c997 100%);color:white; }
        /* 滚动条 */
        ::-webkit-scrollbar { width:8px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.1);border-radius:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.3);border-radius:4px; }
      </style>
    </head>
    <body>
      <div class="app">
        <div class="left">
          <div class="header">
            <h1>🐮 小牛网盘</h1>
            <a href="/logout" class="logout">退出登录</a>
          </div>
          
          <div class="upload-card">
            <h2>上传文件</h2>
            
            <div class="path-section">
              <label>上传路径</label>
              <div class="path-controls">
                <select class="path-select" id="pathSelect">
                  ${pathSelectOptions}
                </select>
                <button class="new-folder" id="newFolderBtn">+ 新建文件夹</button>
              </div>
            </div>
            
            <div class="upload-area" id="uploadArea">
              <div class="upload-icon">📤</div>
              <div class="upload-text">点击或拖拽文件到这里</div>
              <input type="file" name="files" id="fileInput" class="file-input" multiple>
            </div>
            
            <div class="selected">
              <h3>已选择的文件</h3>
              <ul class="selected-list" id="selectedList"></ul>
            </div>
            
            <!-- 上传进度区域 -->
            <div class="progress-container" id="progressContainer" style="display:none;"></div>
            
            <button type="button" class="upload-btn" id="uploadBtn" disabled>上传文件</button>
          </div>
        </div>
        
        <div class="right">
          <div class="path-bar">
            <div class="breadcrumb">
              ${breadcrumbHtml}
            </div>
            <div class="right-actions">
              <button class="action-btn" id="newFolderRightBtn">+ 新建文件夹</button>
              <button class="action-btn" id="refreshBtn">🔄 刷新</button>
            </div>
          </div>
          
          <div class="right-header">
            <input type="text" class="search" id="searchInput" placeholder="搜索文件名...">
            <select class="filter" id="filterSelect">
              <option value="all">全部类型</option>
              <option value="folder">文件夹</option>
              <option value="图片">图片</option>
              <option value="视频">视频</option>
              <option value="音频">音频</option>
              <option value="文档">文档</option>
              <option value="压缩包">压缩包</option>
              <option value="代码">代码</option>
              <option value="其他">其他</option>
            </select>
          </div>
          
          <div class="files">
            <h2>文件列表</h2>
            <ul class="file-list" id="fileList">
              ${fileListHtml}
            </ul>
          </div>
        </div>
      </div>
      
      <div id="modalContainer"></div>
      
      <script>
        const currentPath = '${currentPath}';
        const allFolders = ${JSON.stringify(allFolders)};
        let selectedFiles = [];
        
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const selectedList = document.getElementById('selectedList');
        const uploadBtn = document.getElementById('uploadBtn');
        const progressContainer = document.getElementById('progressContainer');
        const uploadTasks = new Map(); // 存储上传任务
        
        // 切片上传配置
        const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB (更大切片，更少请求)
        const MAX_CONCURRENT = 3; // 并行上传数
        
        // 格式化文件大小
        function formatSize(bytes) {
          if (bytes < 1024) return bytes + ' B';
          if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
          if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
          return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        }
        const searchInput = document.getElementById('searchInput');
        const filterSelect = document.getElementById('filterSelect');
        const fileList = document.getElementById('fileList');
        const pathSelect = document.getElementById('pathSelect');
        const newFolderBtn = document.getElementById('newFolderBtn');
        const newFolderRightBtn = document.getElementById('newFolderRightBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        const modalContainer = document.getElementById('modalContainer');
        
        // 文件选择
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', e => { e.preventDefault();uploadArea.style.borderColor='#667eea'; });
        uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor='rgba(255,255,255,0.5)'; });
        uploadArea.addEventListener('drop', e => {
          e.preventDefault();uploadArea.style.borderColor='rgba(255,255,255,0.5)';
          handleFiles(Array.from(e.dataTransfer.files));
        });
        fileInput.addEventListener('change', e => handleFiles(Array.from(e.target.files)));
        
        function handleFiles(files) {
          selectedFiles = files;
          updateSelectedList();
          uploadBtn.disabled = files.length === 0;
        }
        
        function updateSelectedList() {
          selectedList.innerHTML = selectedFiles.map((file, i) => {
            const size = (file.size / 1024).toFixed(2);
            return '<li class="selected-item"><div class="selected-info"><div class="selected-name">' + file.name + '</div><div class="selected-meta">' + size + ' KB</div></div><button class="remove-btn" onclick="removeFile(' + i + ')">删除</button></li>';
          }).join('');
        }
        
        window.removeFile = function(i) {
          selectedFiles.splice(i,1);
          updateSelectedList();
          uploadBtn.disabled = selectedFiles.length === 0;
          const dt = new DataTransfer();
          selectedFiles.forEach(f => dt.items.add(f));
          fileInput.files = dt.files;
        };
        
        // 点击上传按钮
        uploadBtn.addEventListener('click', startUpload);
        
        // 开始上传
        async function startUpload() {
          if (selectedFiles.length === 0) return;
          
          uploadBtn.disabled = true;
          progressContainer.style.display = 'block';
          
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const uploadPath = pathSelect.value;
            await uploadFileChunked(file, uploadPath, i);
          }
          
          // 上传完成，刷新页面
          setTimeout(() => {
            window.location.href = '/?path=' + encodeURIComponent(pathSelect.value);
          }, 500);
        }
        
        // 切片上传文件
        async function uploadFileChunked(file, uploadPath, fileIndex) {
          const taskId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
          
          // 创建进度条
          const progressHtml = 
            '<div class="progress-item" id="progress-' + taskId + '">' +
              '<div class="progress-item-header">' +
                '<span class="progress-item-name">' + file.name + '</span>' +
                '<span class="progress-item-percent">0%</span>' +
              '</div>' +
              '<div class="progress-bar-bg">' +
                '<div class="progress-bar-fill" style="width:0%"></div>' +
              '</div>' +
              '<div class="progress-actions">' +
                '<button class="progress-btn progress-btn-pause" data-task="' + taskId + '" onclick="pauseUpload(this.dataset.task)">暂停</button>' +
                '<button class="progress-btn progress-btn-cancel" data-task="' + taskId + '" onclick="cancelUpload(this.dataset.task)">取消</button>' +
              '</div>' +
              '<div style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:4px;">' + formatSize(file.size) + ' · 共' + totalChunks + '片</div>' +
            '</div>';
          
          progressContainer.innerHTML += progressHtml;
          
          const task = {
            id: taskId,
            file: file,
            uploadPath: uploadPath,
            totalChunks: totalChunks,
            uploadedChunks: 0,
            paused: false,
            aborted: false
          };
          uploadTasks.set(taskId, task);
          
          // 并行上传分片
          const uploadChunk = async (i) => {
            if (task.aborted) return { aborted: true };
            if (task.paused) await new Promise(resolve => { task.resume = resolve; });
            
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);
            
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkIndex', i);
            formData.append('totalChunks', totalChunks);
            formData.append('fileName', file.name);
            formData.append('fileSize', file.size);
            formData.append('uploadPath', uploadPath);
            formData.append('taskId', taskId);
            
            const response = await fetch('/api/upload/chunk', { method: 'POST', body: formData });
            const result = await response.json();
            
            if (result.success) {
              task.uploadedChunks++;
              const progress = Math.round((task.uploadedChunks / totalChunks) * 100);
              updateProgress(taskId, progress);
            }
            return result;
          };
          
          // 分批并行上传
          for (let i = 0; i < totalChunks; i += MAX_CONCURRENT) {
            if (task.aborted) { removeProgressItem(taskId); return; }
            
            const batch = [];
            for (let j = i; j < Math.min(i + MAX_CONCURRENT, totalChunks); j++) {
              batch.push(uploadChunk(j));
            }
            await Promise.all(batch);
          }
          
          // 最后一片，合并文件
          if (task.uploadedChunks === totalChunks) {
            await mergeFile(taskId, file.name, totalChunks, uploadPath);
            updateProgressComplete(taskId);
          }
        }
        
        // 合并文件
        async function mergeFile(taskId, fileName, totalChunks, uploadPath) {
          const response = await fetch('/api/upload/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId, fileName, totalChunks, uploadPath })
          });
          return await response.json();
        }
        
        // 更新进度条
        function updateProgress(taskId, progress) {
          const item = document.getElementById('progress-' + taskId);
          if (item) {
            item.querySelector('.progress-bar-fill').style.width = progress + '%';
            item.querySelector('.progress-item-percent').textContent = progress + '%';
          }
        }
        
        // 上传完成样式
        function updateProgressComplete(taskId) {
          const item = document.getElementById('progress-' + taskId);
          if (item) {
            item.querySelector('.progress-item-percent').textContent = '完成';
            item.querySelector('.progress-item-percent').style.color = '#20c997';
            item.querySelector('.progress-actions').style.display = 'none';
          }
        }
        
        // 移除进度条
        function removeProgressItem(taskId) {
          const item = document.getElementById('progress-' + taskId);
          if (item) item.remove();
        }
        
        // 暂停上传
        window.pauseUpload = function(taskId) {
          const task = uploadTasks.get(taskId);
          if (task) {
            task.paused = true;
            const item = document.getElementById('progress-' + taskId);
            if (item) {
              const btn = item.querySelector('.progress-btn-pause');
              btn.textContent = '继续';
              btn.className = 'progress-btn progress-btn-resume';
              btn.onclick = () => resumeUpload(taskId);
            }
          }
        };
        
        // 继续上传
        window.resumeUpload = function(taskId) {
          const task = uploadTasks.get(taskId);
          if (task && task.resume) {
            task.paused = false;
            task.resume();
            const item = document.getElementById('progress-' + taskId);
            if (item) {
              const btn = item.querySelector('.progress-btn-resume');
              btn.textContent = '暂停';
              btn.className = 'progress-btn progress-btn-pause';
              btn.onclick = () => pauseUpload(taskId);
            }
          }
        };
        
        // 取消上传
        window.cancelUpload = async function(taskId) {
          const task = uploadTasks.get(taskId);
          if (task) {
            task.aborted = true;
            if (task.resume) task.resume();
            
            // 通知服务器清理
            await fetch('/api/upload/abort', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ taskId })
            });
            
            uploadTasks.delete(taskId);
            removeProgressItem(taskId);
          }
        };
        
        // 路径选择
        pathSelect.value = currentPath;
        pathSelect.addEventListener('change', e => {});
        
        // 导航到文件夹
        window.navigateTo = function(encodedPath, type) {
          if (type === 'folder') {
            window.location.href = '?path=' + encodedPath;
          }
        };
        
        // 新建文件夹
        function createFolder(basePath) {
          showModal({
            title:'新建文件夹',
            input:true,
            placeholder:'请输入文件夹名称',
            confirm:'创建',
            confirmClass:'success',
            onConfirm: async (name) => {
              if (name && name.trim()) {
                try {
                  const res = await fetch('/api/folders', {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({folderPath:basePath,folderName:name.trim()})
                  });
                  const result = await res.json();
                  if (result.success) location.reload();
                  else alert('创建失败：' + result.error);
                } catch(e) { alert('创建失败'); }
              }
            }
          });
        }
        
        newFolderBtn.addEventListener('click', () => createFolder(pathSelect.value));
        newFolderRightBtn.addEventListener('click', () => createFolder(currentPath));
        
        // 刷新
        refreshBtn.addEventListener('click', () => location.reload());
        
        // 搜索和筛选
        function filter() {
          const term = searchInput.value.toLowerCase();
          const type = filterSelect.value;
          const items = fileList.querySelectorAll('.file-item');
          
          items.forEach(item => {
            const name = item.dataset.name;
            const t = item.dataset.type;
            const matchName = name.includes(term);
            const matchType = type === 'all' || t === type;
            item.style.display = matchName && matchType ? 'flex' : 'none';
          });
        }
        searchInput.addEventListener('input', filter);
        filterSelect.addEventListener('change', filter);
        
        // 删除
        window.deleteItem = async function(path, type, name) {
          const confirmed = await showModal({
            title:'确认删除',
            message:'确定要删除' + (type === 'folder' ? '文件夹' : '文件') + ' "' + name + '" 吗？此操作不可恢复！',
            confirm:'删除'
          });
          
          if (confirmed) {
            try {
              const endpoint = type === 'folder' ? '/api/folders' : '/api/files';
              const body = type === 'folder' ? {folderPath:path} : {filePath:path};
              const res = await fetch(endpoint, {
                method:'DELETE',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(body)
              });
              const result = await res.json();
              if (result.success) location.reload();
              else alert('删除失败：' + result.error);
            } catch(e) { alert('删除失败'); }
          }
        };
        
        // 移动文件
        window.showMoveModal = function(sourcePath, type, name) {
          showModal({
            title:'移动到',
            message:'选择目标文件夹（移动 "' + name + '"）',
            select:true,
            options:allFolders,
            confirm:'移动',
            confirmClass:'success',
            onConfirm: async (targetPath) => {
              if (targetPath !== undefined && targetPath !== null) {
                try {
                  const res = await fetch('/api/move', {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({sourcePath, targetPath})
                  });
                  const result = await res.json();
                  if (result.success) location.reload();
                  else alert('移动失败：' + result.error);
                } catch(e) { alert('移动失败'); }
              }
            }
          });
        };
        
        // 弹窗
        function showModal(options) {
          return new Promise((resolve, reject) => {
            let selectHtml = '';
            if (options.select && options.options) {
              selectHtml = '<select id="modalSelect">';
              options.options.forEach(f => {
                selectHtml += '<option value="' + f + '">' + (f === '' ? '根目录' : '/' + f) + '</option>';
              });
              selectHtml += '</select>';
            }
            
            modalContainer.innerHTML = '<div class="modal-overlay" id="overlay"><div class="modal"><h3>' + options.title + '</h3>' + (options.message ? '<p>' + options.message + '</p>' : '') + (options.input ? '<input id="modalInput" placeholder="' + (options.placeholder || '') + '">' : '') + selectHtml + '<div class="modal-btns"><button class="modal-btn modal-btn-cancel" id="cancel">取消</button><button class="modal-btn modal-btn-' + (options.confirmClass || 'confirm') + '" id="confirm">' + (options.confirm || '确认') + '</button></div></div></div>';
            
            const overlay = document.getElementById('overlay');
            const cancel = document.getElementById('cancel');
            const confirm = document.getElementById('confirm');
            const input = document.getElementById('modalInput');
            const select = document.getElementById('modalSelect');
            
            const close = r => { overlay.remove(); resolve(r); };
            cancel.addEventListener('click', () => close(false));
            overlay.addEventListener('click', e => e.target === overlay && close(false));
            
            confirm.addEventListener('click', () => {
              if (options.input) {
                close(input ? input.value : '');
              } else if (options.select) {
                close(select ? select.value : '');
              } else {
                close(true);
              }
            });
            
            if (input) {
              input.focus();
              input.addEventListener('keypress', e => e.key === 'Enter' && confirm.click());
            }
          });
        }
      </script>
    </body>
    </html>
  `);
  } catch (err) {
    console.error('加载页面失败:', err);
    res.status(500).send('加载页面失败');
  }
});

// 切片上传临时目录
const CHUNK_DIR = path.join(__dirname, 'chunks');
fs.ensureDirSync(CHUNK_DIR);

// 切片上传存储配置 - 先存储到临时目录
const chunkUpload = multer({ dest: CHUNK_DIR });

// API：切片上传
app.post('/api/upload/chunk', requireAuth, chunkUpload.single('chunk'), (req, res) => {
  try {
    const { taskId, chunkIndex, totalChunks, fileName, uploadPath } = req.body;
    
    if (!req.file) {
      return res.json({ success: false, error: '没有接收到文件' });
    }
    
    // 创建任务目录并移动文件
    const taskDir = path.join(CHUNK_DIR, String(taskId));
    fs.ensureDirSync(taskDir);
    const targetPath = path.join(taskDir, String(chunkIndex));
    fs.renameSync(req.file.path, targetPath);
    
    res.json({ 
      success: true, 
      chunkIndex: parseInt(chunkIndex),
      needMerge: parseInt(chunkIndex) === parseInt(totalChunks) - 1
    });
  } catch (err) {
    console.error('切片上传失败:', err);
    res.json({ success: false, error: err.message });
  }
});

// API：合并文件（流式，更快）
app.post('/api/upload/merge', requireAuth, async (req, res) => {
  const { taskId, fileName, totalChunks, uploadPath } = req.body;
  
  try {
    const taskDir = path.join(CHUNK_DIR, taskId);
    const targetDir = path.join(BASE_UPLOAD_DIR, uploadPath || '');
    fs.ensureDirSync(targetDir);
    
    // 生成唯一文件名
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const timestamp = Date.now();
    const finalName = `${baseName}-${timestamp}${ext}`;
    const finalPath = path.join(targetDir, finalName);
    
    // 流式合并文件（更快）
    const writeStream = fs.createWriteStream(finalPath, { highWaterMark: 1024 * 1024 });
    
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(taskDir, `${i}`);
      const readStream = fs.createReadStream(chunkPath, { highWaterMark: 1024 * 1024 });
      await new Promise((resolve, reject) => {
        readStream.pipe(writeStream, { end: false });
        readStream.on('end', resolve);
        readStream.on('error', reject);
      });
    }
    
    writeStream.end();
    
    // 异步清理临时文件（不阻塞响应）
    fs.remove(taskDir).catch(() => {});
    
    invalidateCache(uploadPath || '');
    
    res.json({ 
      success: true, 
      filePath: path.join(uploadPath, finalName) 
    });
  } catch (err) {
    console.error('合并文件失败:', err);
    res.json({ success: false, error: err.message });
  }
});

// API：取消上传
app.post('/api/upload/abort', requireAuth, (req, res) => {
  const { taskId } = req.body;
  const taskDir = path.join(CHUNK_DIR, taskId);
  fs.removeSync(taskDir);
  res.json({ success: true });
});

// 路由：上传文件（支持多文件和路径选择）
app.post('/upload', requireAuth, upload.array('files', 20), (req, res) => {
  const uploadPath = req.body.uploadPath || '';
  res.redirect('/?path=' + encodeURIComponent(uploadPath));
});

// 路由：下载文件
app.get('/download/*', requireAuth, (req, res) => {
  const filePath = req.params[0];
  const fullPath = path.join(BASE_UPLOAD_DIR, filePath);
  const filename = path.basename(filePath);
  res.download(fullPath, filename, (err) => {
    if (err) {
      console.error('下载文件失败:', err);
      res.status(404).send('文件未找到');
    }
  });
});

// 路由：退出登录
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('退出登录失败:', err);
    res.redirect('/login');
  });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log('服务器运行在 http://0.0.0.0:' + PORT);
});
