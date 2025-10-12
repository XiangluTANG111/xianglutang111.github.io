# 🚀 Node.js 安装指南

## 为什么需要Node.js？

你的聊天功能需要Node.js来运行后端服务器。前端网页尝试连接`http://localhost:3001/api`，但没有后端服务器在运行。

## 📥 安装步骤

### 1. 下载Node.js
访问官网：https://nodejs.org/

**推荐下载LTS版本（长期支持版本）**

### 2. 安装Node.js
1. 运行下载的安装程序
2. 按照向导完成安装
3. **重要**：确保勾选"Add to PATH"选项

### 3. 验证安装
打开新的命令提示符或PowerShell，运行：
```bash
node --version
npm --version
```

如果显示版本号，说明安装成功。

### 4. 启动聊天后端
```bash
cd "C:\Users\xiang\Downloads\Xianglu Personale website\chatbot-backend"
npm install
npm start
```

### 5. 测试聊天功能
1. 打开你的网站 `index.html`
2. 滚动到聊天部分
3. 发送消息测试

## 🔧 故障排除

### 如果npm命令不工作：
1. 重启命令提示符
2. 检查环境变量PATH是否包含Node.js路径
3. 重新安装Node.js

### 如果端口被占用：
```bash
# 检查端口3001是否被占用
netstat -an | findstr 3001

# 如果被占用，可以修改server.js中的端口号
```

## 📱 替代方案

如果你不想安装Node.js，我可以为你创建一个纯前端的聊天解决方案，使用浏览器直接调用API。

---

**安装Node.js后，你的聊天功能就能正常工作了！**
