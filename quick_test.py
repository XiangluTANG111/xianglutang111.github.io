# 快速测试代码 - 复制到Colab运行
import requests
import json

# 🔑 配置
api_key = "sk-qu856g9uNAIfudyPH9sDBDgwp9YldlcGRnk4UEndo6gKSpbk"
api_urls = [
    "https://api.nuwaapi.com/v1/chat/completions",
    "https://api.nuwaapi.com/v1",
    "https://api.nuwaapi.com"
]

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

# 🧪 简单测试函数
def quick_test():
    print("🚀 开始快速测试...")
    
    for i, url in enumerate(api_urls, 1):
        print(f"\n📍 测试 {i}: {url}")
        
        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': [{"role": "user", "content": "你好"}]
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            print(f"状态码: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data:
                    content = data['choices'][0]['message']['content']
                    print(f"✅ 成功! AI回复: {content}")
                else:
                    print(f"⚠️  响应异常: {data}")
            else:
                print(f"❌ 失败: {response.text}")
                
        except Exception as e:
            print(f"💥 错误: {str(e)}")

# 运行测试
quick_test()
