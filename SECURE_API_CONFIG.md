# 🔐 安全API配置指南

## ⚠️ 重要安全提醒

**你的API密钥已暴露在聊天记录中，请立即采取以下安全措施：**

### 1. 立即更换API密钥
- 登录到你的Nuwa API账户
- 生成新的API密钥
- 删除旧的API密钥

### 2. 安全配置步骤

#### 步骤1：创建环境配置文件
在 `chatbot-backend` 目录下创建 `.env` 文件：

```env
# AI API Configuration
# Option 1: OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Option 2: Nuwa API (Alternative)
NUWA_API_KEY=你的新API密钥
NUWA_API_URL=https://api.nuwaapi.com/v1/chat/completions
USE_NUWA_API=true

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/xianglu_chatbot

# Redis Configuration (optional, for session management)
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_here
```

#### 步骤2：确保.gitignore包含.env
在 `chatbot-backend` 目录下创建或更新 `.gitignore`：

```gitignore
# Environment variables
.env
.env.local
.env.production

# Dependencies
node_modules/

# Logs
logs
*.log
npm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
```

#### 步骤3：安装依赖
```bash
cd chatbot-backend
npm install
```

#### 步骤4：测试API连接
```bash
npm run dev
```

### 3. 部署时的安全措施

#### 生产环境配置
- 使用环境变量而不是硬编码
- 定期轮换API密钥
- 监控API使用量
- 设置使用限制

#### 服务器安全
- 使用HTTPS
- 配置防火墙
- 定期更新依赖
- 监控异常活动

### 4. 监控和报警

#### API使用监控
- 设置使用量警报
- 监控异常请求
- 记录所有API调用

#### 安全监控
- 监控失败的认证尝试
- 检查异常的地理位置访问
- 定期审查访问日志

## 🚨 紧急安全措施

如果你担心API密钥已被泄露：

1. **立即更换密钥**
2. **检查使用记录**
3. **设置使用限制**
4. **监控异常活动**

## 📞 技术支持

如有安全问题，请立即联系：
- Nuwa API支持团队
- 检查API使用仪表板
- 设置使用量警报

---

**记住：永远不要在代码中硬编码API密钥，始终使用环境变量！**








