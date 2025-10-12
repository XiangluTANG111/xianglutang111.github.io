#!/usr/bin/env node

/**
 * Nuwa API 测试脚本
 * 用于验证API连接和配置
 */

const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.NUWA_API_URL || 'https://api.nuwaapi.com/v1/chat/completions';
const API_KEY = process.env.NUWA_API_KEY;

async function testNuwaAPI() {
  console.log('🔍 测试Nuwa API连接...\n');
  
  // 检查环境变量
  if (!API_KEY) {
    console.error('❌ 错误: NUWA_API_KEY 未设置');
    console.log('请在 .env 文件中设置 NUWA_API_KEY');
    process.exit(1);
  }
  
  console.log(`📡 API URL: ${API_URL}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);
  console.log('');
  
  try {
    // 测试API调用
    const response = await axios.post(API_URL, {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一个AI助手，请用中文回复。'
        },
        {
          role: 'user',
          content: '你好，请简单介绍一下自己。'
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 30000 // 30秒超时
    });
    
    console.log('✅ API连接成功！');
    console.log('📝 响应内容:');
    console.log(response.data.choices[0].message.content);
    console.log('');
    console.log('📊 使用统计:');
    console.log(`- 总tokens: ${response.data.usage?.total_tokens || 'N/A'}`);
    console.log(`- 输入tokens: ${response.data.usage?.prompt_tokens || 'N/A'}`);
    console.log(`- 输出tokens: ${response.data.usage?.completion_tokens || 'N/A'}`);
    
  } catch (error) {
    console.error('❌ API调用失败:');
    
    if (error.response) {
      console.error(`状态码: ${error.response.status}`);
      console.error(`错误信息: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('网络错误: 无法连接到API服务器');
      console.error('请检查网络连接和API URL');
    } else {
      console.error(`其他错误: ${error.message}`);
    }
    
    process.exit(1);
  }
}

// 运行测试
testNuwaAPI().catch(console.error);




