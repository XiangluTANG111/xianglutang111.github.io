#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nuwa API 测试脚本 - 适用于 Google Colab
测试API连接、认证和响应
"""

import requests
import json
import time

# ==================== 配置区域 ====================
# 请在这里填入您的API密钥
NUWA_API_KEY = "your_api_key_here"  # 请替换为您的实际API密钥

# API端点配置
API_ENDPOINTS = {
    "direct": "https://api.nuwa.ai/v1/chat/completions",
    "proxy1": "https://api.openai-proxy.com/v1/chat/completions",
    "proxy2": "https://api.openai.com/v1/chat/completions"
}

# 测试消息
TEST_MESSAGES = [
    {"role": "user", "content": "你好，请简单介绍一下自己"}
]

# ==================== 测试函数 ====================

def test_api_connection(endpoint_name, endpoint_url):
    """测试API连接"""
    print(f"\n🔍 测试 {endpoint_name}: {endpoint_url}")
    print("-" * 50)
    
    try:
        # 准备请求数据
        payload = {
            "model": "gpt-4o#net#net",
            "group": "校企高速专线",
            "messages": TEST_MESSAGES,
            "stream": True,
            "temperature": 0.7,
            "top_p": 1,
            "max_tokens": 4096,
            "frequency_penalty": 0,
            "presence_penalty": 0
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {NUWA_API_KEY}"
        }
        
        print("📤 发送请求...")
        print(f"   模型: {payload['model']}")
        print(f"   组别: {payload['group']}")
        print(f"   消息: {TEST_MESSAGES[0]['content']}")
        
        # 发送请求
        start_time = time.time()
        response = requests.post(
            endpoint_url,
            headers=headers,
            json=payload,
            timeout=30
        )
        end_time = time.time()
        
        print(f"⏱️  响应时间: {end_time - start_time:.2f}秒")
        print(f"📊 状态码: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ 连接成功！")
            try:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    content = data['choices'][0]['message']['content']
                    print(f"🤖 AI回复: {content}")
                else:
                    print("⚠️  响应格式异常")
                    print(f"   响应内容: {data}")
            except json.JSONDecodeError:
                print("⚠️  JSON解析失败")
                print(f"   原始响应: {response.text[:200]}...")
        else:
            print("❌ 连接失败")
            print(f"   错误信息: {response.text}")
            
    except requests.exceptions.Timeout:
        print("⏰ 请求超时")
    except requests.exceptions.ConnectionError:
        print("🔌 连接错误")
    except Exception as e:
        print(f"💥 未知错误: {str(e)}")

def test_streaming_response(endpoint_name, endpoint_url):
    """测试流式响应"""
    print(f"\n🌊 测试流式响应: {endpoint_name}")
    print("-" * 50)
    
    try:
        payload = {
            "model": "gpt-4o#net#net",
            "group": "校企高速专线",
            "messages": [{"role": "user", "content": "请写一首关于春天的短诗"}],
            "stream": True,
            "temperature": 0.7,
            "max_tokens": 200
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {NUWA_API_KEY}"
        }
        
        print("📤 发送流式请求...")
        response = requests.post(
            endpoint_url,
            headers=headers,
            json=payload,
            stream=True,
            timeout=30
        )
        
        if response.status_code == 200:
            print("✅ 流式连接成功！")
            print("📝 流式响应内容:")
            print("-" * 30)
            
            full_content = ""
            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        data_str = line_str[6:]  # 移除 'data: ' 前缀
                        if data_str.strip() == '[DONE]':
                            break
                        try:
                            data = json.loads(data_str)
                            if 'choices' in data and len(data['choices']) > 0:
                                delta = data['choices'][0].get('delta', {})
                                if 'content' in delta:
                                    content = delta['content']
                                    print(content, end='', flush=True)
                                    full_content += content
                        except json.JSONDecodeError:
                            continue
            
            print(f"\n\n📄 完整回复: {full_content}")
        else:
            print(f"❌ 流式请求失败: {response.status_code}")
            print(f"   错误: {response.text}")
            
    except Exception as e:
        print(f"💥 流式测试错误: {str(e)}")

def main():
    """主测试函数"""
    print("🚀 Nuwa API 测试开始")
    print("=" * 60)
    
    # 检查API密钥
    if NUWA_API_KEY == "your_api_key_here":
        print("⚠️  请先设置您的API密钥！")
        print("   在代码中找到 NUWA_API_KEY 变量并替换为您的实际密钥")
        return
    
    print(f"🔑 使用API密钥: {NUWA_API_KEY[:10]}...")
    
    # 测试所有端点
    for name, url in API_ENDPOINTS.items():
        test_api_connection(name, url)
        time.sleep(1)  # 避免请求过于频繁
    
    # 测试流式响应（使用第一个端点）
    first_endpoint = list(API_ENDPOINTS.items())[0]
    test_streaming_response(first_endpoint[0], first_endpoint[1])
    
    print("\n🎉 测试完成！")
    print("=" * 60)

# ==================== 运行测试 ====================
if __name__ == "__main__":
    main()




