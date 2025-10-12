# 🔧 CORS问题解决方案

## 问题描述
前端JavaScript无法直接调用Nuwa API，因为浏览器的CORS（跨域资源共享）策略阻止了跨域请求。

## 解决方案
使用Node.js代理服务器作为中间层，解决CORS问题。

## 🚀 快速启动

### 1. 安装依赖
```bash
npm install express cors axios dotenv
```

### 2. 配置环境变量
创建 `.env` 文件：
```
NUWA_API_KEY=your_api_key_here
NUWA_API_URL=https://api.nuwaapi.com/v1/chat/completions
PROXY_PORT=3001
```

### 3. 启动代理服务器
```bash
# 方法1: 使用批处理文件
start-proxy.bat

# 方法2: 直接运行
node cors-proxy.js
```

### 4. 测试代理服务器
访问: http://localhost:3001/api/health

## 📋 工作原理

1. **前端** → 发送请求到 `http://localhost:3001/api/chat`
2. **代理服务器** → 转发请求到Nuwa API
3. **Nuwa API** → 返回响应给代理服务器
4. **代理服务器** → 转发响应给前端

## 🔍 调试信息

### 代理服务器日志
```
🚀 CORS代理服务器已启动
📡 监听端口: 3001
🌐 健康检查: http://localhost:3001/api/health
💬 聊天代理: http://localhost:3001/api/chat
```

### 前端控制台日志
```
🔄 尝试本地代理服务器...
✅ 代理服务器响应成功
```

## 🛠️ 故障排除

### 1. 代理服务器无法启动
- 检查Node.js是否安装: `node --version`
- 检查端口3001是否被占用
- 检查.env文件中的API密钥

### 2. 前端无法连接代理
- 确保代理服务器正在运行
- 检查防火墙设置
- 尝试访问: http://localhost:3001/api/health

### 3. API调用失败
- 检查NUWA_API_KEY是否正确
- 查看代理服务器控制台错误信息
- 检查网络连接

## 📁 文件结构
```
├── cors-proxy.js          # 代理服务器
├── start-proxy.bat        # 启动脚本
├── .env                   # 环境变量配置
└── index.html             # 前端页面（已修改）
```

## 🔄 备用方案
如果代理服务器失败，前端会自动尝试直接API调用，并显示智能备用回复。

## 📞 支持
如果遇到问题，请检查：
1. 代理服务器是否正在运行
2. 环境变量是否正确配置
3. 网络连接是否正常




