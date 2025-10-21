# Google Colab 测试代码
# 复制这段代码到 Colab 中运行

import requests
import json

# 🔑 设置您的API密钥
API_KEY = "your_api_key_here"  # 请替换为您的实际API密钥

# 🌐 API端点
API_URL = "https://api.nuwa.ai/v1/chat/completions"

def test_nuwa_api():
    """测试Nuwa API"""
    
    # 准备请求数据
    payload = {
        "model": "gpt-4o#net#net",
        "group": "校企高速专线",
        "messages": [
            {"role": "user", "content": "你好，请简单介绍一下自己"}
        ],
        "stream": True,
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    print("🚀 开始测试Nuwa API...")
    print(f"📡 端点: {API_URL}")
    print(f"🔑 API密钥: {API_KEY[:10]}...")
    print(f"🤖 模型: {payload['model']}")
    print(f"👥 组别: {payload['group']}")
    print("-" * 50)
    
    try:
        # 发送请求
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        
        print(f"📊 状态码: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ 连接成功！")
            
            # 处理流式响应
            print("📝 流式响应:")
            print("-" * 30)
            
            full_content = ""
            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        data_str = line_str[6:]
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
                        except:
                            continue
            
            print(f"\n\n📄 完整回复: {full_content}")
            print("\n🎉 测试成功！API工作正常！")
            
        else:
            print("❌ 请求失败")
            print(f"错误信息: {response.text}")
            
    except Exception as e:
        print(f"💥 测试失败: {str(e)}")

# 运行测试
if __name__ == "__main__":
    test_nuwa_api()




