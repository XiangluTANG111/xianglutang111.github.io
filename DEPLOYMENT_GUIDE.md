# Xianglu Chatbot 部署指南

## 概述
本指南将帮助您部署基于Xianglu个人经历的AI聊天机器人系统。系统包括：
- 前端：个人网站（已集成chatbot界面）
- 后端：Node.js API服务器
- 数据库：PostgreSQL + Redis（可选）

## 系统架构

```
前端 (index.html)
    ↓ HTTP请求
后端API (Node.js + Express)
    ↓ 调用
OpenAI GPT-4 API
    ↓ 存储
PostgreSQL数据库
    ↓ 缓存
Redis (可选)
```

## 部署步骤

### 1. 环境准备

#### 必需软件
- Node.js (v18+)
- PostgreSQL (v13+)
- Redis (可选，用于会话管理)

#### 必需API密钥
- OpenAI API密钥

### 2. 后端部署

#### 2.1 安装依赖
```bash
cd chatbot-backend
npm install
```

#### 2.2 环境配置
复制 `env.example` 为 `.env` 并配置：
```bash
cp env.example .env
```

编辑 `.env` 文件：
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/xianglu_chatbot

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com
```

#### 2.3 数据库设置
```bash
# 创建数据库
createdb xianglu_chatbot

# 运行SQL脚本
psql xianglu_chatbot < database.sql
```

#### 2.4 启动后端服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 3. 前端配置

#### 3.1 更新API端点
在 `index.html` 中，将API_BASE_URL更新为您的后端地址：
```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

#### 3.2 部署前端
将整个网站文件夹上传到您的Web服务器。

### 4. 生产环境部署

#### 4.1 使用PM2管理Node.js进程
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "xianglu-chatbot"

# 设置开机自启
pm2 startup
pm2 save
```

#### 4.2 使用Nginx反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/your/website;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4.3 SSL证书配置
使用Let's Encrypt获取免费SSL证书：
```bash
sudo certbot --nginx -d your-domain.com
```

### 5. 监控和维护

#### 5.1 日志监控
```bash
# 查看PM2日志
pm2 logs xianglu-chatbot

# 查看错误日志
pm2 logs xianglu-chatbot --err
```

#### 5.2 数据库备份
```bash
# 创建备份脚本
#!/bin/bash
pg_dump xianglu_chatbot > backup_$(date +%Y%m%d_%H%M%S).sql

# 设置定时备份（crontab）
0 2 * * * /path/to/backup_script.sh
```

#### 5.3 性能监控
- 使用PM2监控进程状态
- 监控数据库连接数
- 监控API响应时间

### 6. 安全配置

#### 6.1 环境变量安全
- 确保 `.env` 文件不被提交到版本控制
- 使用强密码和API密钥
- 定期轮换API密钥

#### 6.2 数据库安全
- 使用强密码
- 限制数据库访问IP
- 启用SSL连接

#### 6.3 API安全
- 实施速率限制
- 使用HTTPS
- 验证输入数据

### 7. 故障排除

#### 常见问题

**1. API连接失败**
- 检查后端服务是否运行
- 验证CORS配置
- 检查防火墙设置

**2. OpenAI API错误**
- 验证API密钥
- 检查API配额
- 查看OpenAI服务状态

**3. 数据库连接错误**
- 检查数据库服务状态
- 验证连接字符串
- 检查网络连接

**4. 前端无法加载**
- 检查文件路径
- 验证Web服务器配置
- 查看浏览器控制台错误

### 8. 扩展功能

#### 8.1 添加用户认证
```javascript
// 在server.js中添加JWT认证
const jwt = require('jsonwebtoken');

// 中间件验证
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

#### 8.2 添加分析功能
```javascript
// 记录用户行为
app.post('/api/analytics', async (req, res) => {
  const { event, data } = req.body;
  await pool.query(
    'INSERT INTO analytics (session_id, event_type, event_data) VALUES ($1, $2, $3)',
    [req.sessionId, event, JSON.stringify(data)]
  );
  res.json({ success: true });
});
```

#### 8.3 多语言支持
```javascript
// 根据用户语言调整响应
const systemPrompt = createSystemPrompt(userLanguage);
```

## 成本估算

### 开发环境
- OpenAI API: ~$20-50/月（取决于使用量）
- 服务器: $5-20/月
- 数据库: $0-10/月

### 生产环境
- OpenAI API: $50-200/月
- 服务器: $20-100/月
- 数据库: $10-50/月
- 监控工具: $10-30/月

## 联系支持

如有问题，请联系：
- 邮箱: xianglutang111@gmail.com
- 项目文档: 查看README.md
- 技术问题: 查看GitHub Issues

---

**注意**: 请确保在生产环境中使用强密码、HTTPS和适当的监控工具。