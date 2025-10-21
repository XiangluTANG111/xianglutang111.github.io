# 🚀 Nuwa API 部署指南

## ⚠️ 紧急安全提醒

**你的API密钥已在聊天中暴露，请立即：**
1. 更换新的API密钥
2. 删除旧的API密钥
3. 检查使用记录

## 🔧 配置步骤

### 1. 环境配置

#### 创建 .env 文件
在 `chatbot-backend` 目录下创建 `.env` 文件：

```env
# Nuwa API Configuration
NUWA_API_KEY=你的新API密钥
NUWA_API_URL=https://api.nuwaapi.com/v1/chat/completions
USE_NUWA_API=true

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/xianglu_chatbot

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 2. 安装依赖

```bash
cd chatbot-backend
npm install
```

### 3. 测试API连接

```bash
# 测试Nuwa API
npm run test-api

# 如果成功，你会看到：
# ✅ API连接成功！
# 📝 响应内容: [AI回复]
```

### 4. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 🌐 部署到生产环境

### 方案1：VPS部署

#### 服务器要求
- Ubuntu 20.04+ 或 CentOS 8+
- Node.js 18+
- PostgreSQL 13+
- Nginx (可选)

#### 部署步骤
```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 安装PostgreSQL
sudo apt install postgresql postgresql-contrib

# 4. 创建数据库
sudo -u postgres createdb xianglu_chatbot
sudo -u postgres psql xianglu_chatbot < database.sql

# 5. 上传代码
scp -r chatbot-backend/ user@your-server:/opt/

# 6. 安装依赖
cd /opt/chatbot-backend
npm install --production

# 7. 配置环境变量
nano .env
# 添加生产环境配置

# 8. 使用PM2管理进程
npm install -g pm2
pm2 start server.js --name "xianglu-chatbot"
pm2 startup
pm2 save
```

### 方案2：Docker部署

#### 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

#### 部署命令
```bash
# 构建镜像
docker build -t xianglu-chatbot .

# 运行容器
docker run -d \
  --name xianglu-chatbot \
  -p 3001:3001 \
  --env-file .env \
  xianglu-chatbot
```

### 方案3：云服务部署

#### Heroku部署
```bash
# 1. 安装Heroku CLI
# 2. 登录
heroku login

# 3. 创建应用
heroku create xianglu-chatbot

# 4. 设置环境变量
heroku config:set NUWA_API_KEY=your_key
heroku config:set USE_NUWA_API=true

# 5. 部署
git push heroku main
```

#### Railway部署
```bash
# 1. 连接GitHub仓库
# 2. 设置环境变量
# 3. 自动部署
```

## 🔒 安全配置

### 1. API密钥安全
- ✅ 使用环境变量
- ✅ 不在代码中硬编码
- ✅ 定期轮换密钥
- ✅ 监控使用量

### 2. 服务器安全
- ✅ 使用HTTPS
- ✅ 配置防火墙
- ✅ 定期更新
- ✅ 监控日志

### 3. 数据库安全
- ✅ 强密码
- ✅ 限制访问IP
- ✅ 定期备份
- ✅ 加密连接

## 📊 监控和维护

### 1. 日志监控
```bash
# PM2日志
pm2 logs xianglu-chatbot

# 系统日志
tail -f /var/log/nginx/access.log
```

### 2. 性能监控
- API响应时间
- 数据库连接数
- 内存使用情况
- CPU使用率

### 3. 备份策略
```bash
# 数据库备份
pg_dump xianglu_chatbot > backup_$(date +%Y%m%d).sql

# 代码备份
tar -czf code_backup_$(date +%Y%m%d).tar.gz chatbot-backend/
```

## 🚨 故障排除

### 常见问题

#### 1. API连接失败
```bash
# 检查网络
ping api.nuwaapi.com

# 检查API密钥
curl -H "Authorization: Bearer YOUR_KEY" https://api.nuwaapi.com/v1/chat/completions
```

#### 2. 数据库连接错误
```bash
# 检查PostgreSQL状态
sudo systemctl status postgresql

# 检查连接
psql -h localhost -U username -d xianglu_chatbot
```

#### 3. 端口冲突
```bash
# 检查端口使用
netstat -tlnp | grep 3001

# 更改端口
export PORT=3002
```

## 💰 成本估算

### 开发环境
- Nuwa API: $20-50/月
- 服务器: $5-20/月
- 数据库: $0-10/月

### 生产环境
- Nuwa API: $50-200/月
- 服务器: $20-100/月
- 数据库: $10-50/月
- 监控: $10-30/月

## 📞 技术支持

如有问题，请检查：
1. API密钥是否正确
2. 网络连接是否正常
3. 服务器资源是否充足
4. 日志文件中的错误信息

---

**记住：永远不要在代码中硬编码API密钥！**





