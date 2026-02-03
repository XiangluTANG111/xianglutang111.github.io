# 🔧 API配置指南

## 📋 当前配置状态

### ❌ 需要修复的问题：

1. **API密钥未设置**：
   ```javascript
   const NUWA_API_KEY = 'YOUR_NUWA_API_KEY_HERE'; // 还是占位符！
   ```

2. **API端点验证**：
   ```javascript
   const NUWA_API_URL = 'https://api.nuwaapi.com/v1/chat/completions';
   ```

## 🚀 修复步骤

### 步骤1：获取Nuwa API密钥

1. **访问Nuwa密钥管理页面**：
   - 打开：https://key.nuwaapi.com
   - 登录你的Nuwa账户

2. **生成API密钥**：
   - 点击"创建新密钥"或"Generate New Key"
   - 复制生成的密钥（格式类似：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

### 步骤2：更新index.html文件

1. **打开文件**：
   - 用记事本或任何文本编辑器打开 `index.html`

2. **找到第1026行**：
   ```javascript
   const NUWA_API_KEY = 'YOUR_NUWA_API_KEY_HERE';
   ```

3. **替换为你的真实密钥**：
   ```javascript
   const NUWA_API_KEY = 'sk-your-actual-api-key-here';
   ```

### 步骤3：验证API端点

当前配置的端点：
```javascript
const NUWA_API_URL = 'https://api.nuwaapi.com/v1/chat/completions';
```

这个端点看起来是正确的，但让我们验证一下。

## 🧪 测试配置

### 测试方法1：浏览器控制台
1. 打开 `index.html`
2. 按F12打开开发者工具
3. 在控制台中输入：
   ```javascript
   console.log('API Key:', NUWA_API_KEY);
   console.log('API URL:', NUWA_API_URL);
   ```

### 测试方法2：发送测试消息
1. 滚动到聊天部分
2. 发送消息："你好"
3. 查看是否有错误信息

## 🔍 常见错误及解决方案

### 错误1：API密钥无效
```
Error: API错误: 401
```
**解决方案**：检查API密钥是否正确复制

### 错误2：网络连接失败
```
Error: Failed to fetch
```
**解决方案**：检查网络连接，确认API端点可访问

### 错误3：CORS错误
```
Error: CORS policy
```
**解决方案**：这是正常的，Nuwa API应该支持CORS

## 📞 获取帮助

如果仍有问题：
1. 检查Nuwa API文档：https://nuwaapi.apifox.cn
2. 确认账户有足够的API额度
3. 尝试在Nuwa控制台测试API调用

---

**配置完成后，你的聊天功能就能正常工作了！**









