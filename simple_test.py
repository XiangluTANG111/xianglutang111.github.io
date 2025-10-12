# 简化测试 - 基于可工作代码
import requests
import time

# 配置
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

# 测试函数
def simple_test():
    print("🚀 开始简单测试...")
    
    post = "我今天心情很糟糕，工作压力很大"
    prompt = f"You are a life coach. Help me reframe this post：{post}"
    
    payload = {
        'model': 'gpt-3.5-turbo',
        'messages': [{"role": "user", "content": prompt}]
    }
    
    success = False
    for url in api_urls:
        try:
            print(f"🔍 尝试: {url}")
            r = requests.post(url, json=payload, headers=headers, timeout=20)
            
            if r.status_code == 200:
                data = r.json()
                if 'choices' in data and len(data['choices']) > 0:
                    ai_reply = data['choices'][0]['message']['content']
                    print(f"✅ 成功! AI回复: {ai_reply}")
                    success = True
                    break
                else:
                    print(f"⚠️  响应异常: {data}")
            else:
                print(f"❌ 状态码 {r.status_code}")
        except Exception as e:
            print(f"💥 异常: {e}")
        
        time.sleep(1)
    
    if not success:
        print("🚫 所有端点都失败了")

# 运行
simple_test()
