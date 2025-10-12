# EmailJS 设置指南

## 概述
我已经为你的网站添加了EmailJS功能，现在你的联系表单可以真正发送邮件了！但是你需要完成以下设置步骤才能让功能正常工作。

## 设置步骤

### 1. 注册EmailJS账号
1. 访问 [EmailJS官网](https://www.emailjs.com/)
2. 点击 "Sign Up" 注册免费账号
3. 验证你的邮箱地址

### 2. 创建邮件服务
1. 登录后，进入 Dashboard
2. 点击 "Email Services" 
3. 点击 "Add New Service"
4. 选择你的邮件服务提供商（推荐Gmail）：
   - **Gmail**: 选择Gmail，然后按照指示连接你的Gmail账号
   - **Outlook**: 选择Outlook/Hotmail
   - **其他**: 选择其他支持的邮件服务

### 3. 创建邮件模板
1. 在Dashboard中点击 "Email Templates"
2. 点击 "Create New Template"
3. 使用以下模板内容：

**模板设置：**
- **Template Name**: `contact_form`
- **Subject**: `New Contact Form Message from {{from_name}}`
- **Content**:
```
From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your personal website contact form.
```

### 4. 获取配置信息
完成上述步骤后，你需要获取以下信息：

1. **Public Key**: 在Dashboard的 "Account" 部分找到
2. **Service ID**: 在 "Email Services" 部分找到你刚创建的服务ID
3. **Template ID**: 在 "Email Templates" 部分找到你刚创建的模板ID

### 5. 更新网站配置 ✅ 已完成部分
我已经更新了你的网站代码，使用了你提供的配置信息：

#### ✅ 已完成的配置：
- **Service ID**: `XiangluDEFAULT` (已更新到代码中)
- **Template ID**: `template_h6201hd` (已更新到代码中)

#### 🔄 还需要完成的配置：
你只需要替换 **Public Key**：

**在 `index.html` 第496行：**
```javascript
// 当前代码
emailjs.init("YOUR_PUBLIC_KEY"); // 替换为你的实际Public Key

// 替换为你的Public Key (在EmailJS Dashboard的Account页面找到)
emailjs.init("你的实际Public Key");
```

**获取Public Key的步骤：**
1. 登录 [EmailJS Dashboard](https://dashboard.emailjs.com/admin)
2. 点击左侧菜单的 "Account"
3. 在 "API Keys" 部分找到你的 Public Key
4. 复制并替换代码中的 `"YOUR_PUBLIC_KEY"`

## 功能特性

✅ **表单验证**: 所有字段都是必填的
✅ **加载状态**: 提交时显示加载动画
✅ **成功反馈**: 邮件发送成功后显示绿色成功消息
✅ **错误处理**: 发送失败时显示错误消息和备用联系方式
✅ **表单重置**: 成功发送后自动清空表单
✅ **响应式设计**: 在所有设备上都能正常工作

## 测试功能

1. 完成所有设置后，打开你的网站
2. 滚动到 "Get in Touch" 部分
3. 填写表单并提交
4. 检查你的邮箱是否收到邮件
5. 查看浏览器控制台是否有错误信息

## 免费额度

EmailJS免费计划包括：
- 每月200封邮件
- 2个邮件服务
- 2个邮件模板
- 基本支持

对于个人网站来说，这通常足够了。

## 故障排除

### 常见问题：

1. **邮件没有收到**
   - 检查垃圾邮件文件夹
   - 确认Service ID和Template ID正确
   - 检查浏览器控制台是否有错误

2. **"emailjs is not defined" 错误**
   - 确认EmailJS CDN已正确加载
   - 检查网络连接

3. **表单提交没有反应**
   - 检查Public Key是否正确
   - 确认所有ID都已正确替换

### 调试步骤：
1. 打开浏览器开发者工具 (F12)
2. 查看Console标签页的错误信息
3. 检查Network标签页的网络请求

## 联系支持

如果遇到问题：
1. 查看 [EmailJS文档](https://www.emailjs.com/docs/)
2. 访问 [EmailJS社区论坛](https://community.emailjs.com/)
3. 直接联系我：xianglutang111@gmail.com

---

**注意**: 请妥善保管你的EmailJS配置信息，不要公开分享你的Public Key、Service ID和Template ID。
