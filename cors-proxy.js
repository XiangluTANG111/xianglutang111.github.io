#!/usr/bin/env node

/**
 * CORS代理服务器
 * 解决前端调用Nuwa API的跨域问题
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

// 启用CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'file://'],
  credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 代理API端点
app.post('/api/chat', async (req, res) => {
  try {
    console.log('📨 收到聊天请求:', req.body);
    
    const { messages, model = 'gpt-3.5-turbo', max_tokens = 500, temperature = 0.7 } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const API_URL = process.env.NUWA_API_URL || 'https://api.nuwaapi.com/v1/chat/completions';
    const API_KEY = process.env.NUWA_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('🔄 转发请求到Nuwa API...');
    
    const response = await axios.post(API_URL, {
      model,
      messages,
      max_tokens,
      temperature
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 30000
    });

    console.log('✅ API响应成功');
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ 代理错误:', error.message);
    
    if (error.response) {
      console.error('API错误响应:', error.response.status, error.response.data);
      res.status(error.response.status).json({
        error: 'API request failed',
        details: error.response.data
      });
    } else if (error.request) {
      console.error('网络错误: 无法连接到API');
      res.status(503).json({
        error: 'Network error',
        details: 'Unable to connect to API server'
      });
    } else {
      console.error('其他错误:', error.message);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    proxy: 'CORS Proxy Server',
    version: '1.0.0'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 CORS代理服务器已启动');
  console.log(`📡 监听端口: ${PORT}`);
  console.log(`🌐 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`💬 聊天代理: http://localhost:${PORT}/api/chat`);
  console.log('');
  console.log('📋 使用说明:');
  console.log('1. 确保已设置环境变量 NUWA_API_KEY');
  console.log('2. 前端应调用 http://localhost:3001/api/chat');
  console.log('3. 保持此服务器运行以处理API请求');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭代理服务器...');
  process.exit(0);
});









