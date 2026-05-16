// 切片上传模块 - 前端JavaScript

const ChunkUploader = {
  CHUNK_SIZE: 5 * 1024 * 1024, // 5MB每片
  uploads: new Map(), // 上传任务管理
  
  // 创建上传任务
  createTask(file, uploadPath) {
    const taskId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const chunks = Math.ceil(file.size / this.CHUNK_SIZE);
    
    const task = {
      id: taskId,
      file: file,
      uploadPath: uploadPath,
      chunks: chunks,
      uploadedChunks: 0,
      paused: false,
      aborted: false,
      progress: 0
    };
    
    this.uploads.set(taskId, task);
    return taskId;
  },
  
  // 开始上传
  async start(taskId, onProgress, onComplete, onError) {
    const task = this.uploads.get(taskId);
    if (!task) return;
    
    const file = task.file;
    const totalChunks = task.chunks;
    
    for (let i = 0; i < totalChunks; i++) {
      if (task.paused) {
        await new Promise(resolve => {
          task.resume = resolve;
        });
      }
      
      if (task.aborted) {
        onError('上传已取消');
        return;
      }
      
      const start = i * this.CHUNK_SIZE;
      const end = Math.min(start + this.CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', i);
      formData.append('totalChunks', totalChunks);
      formData.append('fileName', file.name);
      formData.append('fileSize', file.size);
      formData.append('uploadPath', task.uploadPath);
      formData.append('taskId', taskId);
      
      try {
        const response = await fetch('/api/upload/chunk', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          task.uploadedChunks++;
          task.progress = Math.round((task.uploadedChunks / totalChunks) * 100);
          onProgress(task.progress, i + 1, totalChunks);
          
          // 所有分片上传完成，合并文件
          if (result.needMerge || task.uploadedChunks === totalChunks) {
            const mergeResult = await this.mergeFile(taskId, file.name, totalChunks, task.uploadPath);
            if (mergeResult.success) {
              onComplete(mergeResult.filePath);
            } else {
              onError(mergeResult.error || '合并文件失败');
            }
          }
        } else {
          onError(result.error || '上传失败');
          return;
        }
      } catch (err) {
        onError(err.message);
        return;
      }
    }
  },
  
  // 合并文件
  async mergeFile(taskId, fileName, totalChunks, uploadPath) {
    const response = await fetch('/api/upload/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, fileName, totalChunks, uploadPath })
    });
    return await response.json();
  },
  
  // 暂停上传
  pause(taskId) {
    const task = this.uploads.get(taskId);
    if (task) task.paused = true;
  },
  
  // 继续上传
  resume(taskId) {
    const task = this.uploads.get(taskId);
    if (task && task.resume) {
      task.paused = false;
      task.resume();
    }
  },
  
  // 取消上传
  abort(taskId) {
    const task = this.uploads.get(taskId);
    if (task) {
      task.aborted = true;
      if (task.resume) task.resume();
      this.uploads.delete(taskId);
    }
  }
};

// 导出给全局使用
window.ChunkUploader = ChunkUploader;
