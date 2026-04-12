
const express = require('express');
const session = require('express-session');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_PATH = path.join(__dirname, 'data', 'secure.db');

// 确保必要的目录存在
fs.ensureDirSync(UPLOAD_DIR);
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
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

// 路由：登录页面
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>登录</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 2rem auto; padding: 0 1rem; }
        h1 { color: #333; }
        form div { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.5rem; box-sizing: border-box; }
        button { padding: 0.5rem 1.5rem; background-color: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #0056b3; }
      </style>
    </head>
    <body>
      <h1>登录</h1>
      <form method="POST" action="/login">
        <div>
          <label>用户名:</label>
          <input type="text" name="username" required>
        </div>
        <div>
          <label>密码:</label>
          <input type="password" name="password" required>
        </div>
        <button type="submit">登录</button>
      </form>
      <p>还没有账号？<a href="/register">注册</a></p>
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
      <title>注册</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 2rem auto; padding: 0 1rem; }
        h1 { color: #333; }
        form div { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.5rem; box-sizing: border-box; }
        button { padding: 0.5rem 1.5rem; background-color: #28a745; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #218838; }
      </style>
    </head>
    <body>
      <h1>注册</h1>
      <form method="POST" action="/register">
        <div>
          <label>用户名:</label>
          <input type="text" name="username" required>
        </div>
        <div>
          <label>密码:</label>
          <input type="password" name="password" required>
        </div>
        <button type="submit">注册</button>
      </form>
      <p>已有账号？<a href="/login">登录</a></p>
    </body>
    </html>
  `);
});

// 路由：处理注册
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashedPassword);
    res.redirect('/login');
  } catch (err) {
    console.error('注册失败:', err);
    res.send('注册失败：用户名可能已存在');
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
      res.send('用户名或密码错误');
    }
  } catch (err) {
    console.error('登录失败:', err);
    res.send('登录时发生错误');
  }
});

// 路由：主页（需要登录）
app.get('/', requireAuth, (req, res) => {
  // 获取上传目录下的文件列表
  let files = [];
  try {
    files = fs.readdirSync(UPLOAD_DIR).map(filename => {
      const filePath = path.join(UPLOAD_DIR, filename);
      const stats = fs.statSync(filePath);
      return {
        name: filename,
        size: stats.size,
        uploaded: new Date(stats.mtime).toLocaleString('zh-CN')
      };
    });
  } catch (err) {
    console.error('读取文件列表失败:', err);
  }

  // 生成文件列表 HTML
  const fileListHtml = files.map(file => `
    <li style="margin-bottom: 0.5rem; padding: 0.5rem; background-color: #f8f9fa; border-radius: 4px;">
      <strong>${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB) - ${file.uploaded}
      <a href="/download/${encodeURIComponent(file.name)}" style="margin-left: 1rem; color: #007bff;">下载</a>
    </li>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>文件服务器</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        h1, h2 { color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 1rem; }
        .logout { color: #dc3545; text-decoration: none; }
        form { margin-bottom: 2rem; padding: 1rem; background-color: #f8f9fa; border-radius: 8px; }
        input[type="file"] { margin-bottom: 1rem; }
        button { padding: 0.5rem 1.5rem; background-color: #007bff; color: white; border: none; cursor: pointer; border-radius: 4px; }
        button:hover { background-color: #0056b3; }
        ul { list-style-type: none; padding: 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>文件服务器</h1>
        <a href="/logout" class="logout">退出登录</a>
      </div>
      
      <h2>上传文件</h2>
      <form method="POST" action="/upload" enctype="multipart/form-data">
        <input type="file" name="file" required>
        <br>
        <button type="submit">上传</button>
      </form>
      
      <h2>文件列表</h2>
      <ul>
        ${fileListHtml || '<li>暂无文件</li>'}
      </ul>
    </body>
    </html>
  `);
});

// 路由：上传文件
app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  res.redirect('/');
});

// 路由：下载文件
app.get('/download/:filename', requireAuth, (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(UPLOAD_DIR, filename);
  res.download(filePath, filename, (err) => {
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
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
});
