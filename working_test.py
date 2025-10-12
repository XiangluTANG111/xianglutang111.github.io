# 基于您提供的可工作代码的测试版本
# 这个版本应该能正常工作

import requests
import json
import time

# 🔑 API配置 - 使用您提供的可工作配置
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

def test_working_api():
    """基于可工作代码的测试"""
    print("🚀 开始测试API（基于可工作代码）")
    print("=" * 50)
    
    # 测试数据
    test_posts = [
        "我今天心情很糟糕，工作压力很大",
        "感觉生活没有意义，很迷茫",
        "人际关系处理不好，总是得罪人"
    ]
    
    results = []
    
    for idx, post in enumerate(test_posts):
        print(f"\n📍 处理测试 {idx+1}: {post}")
        
        prompt = f"You are a life coach. Help me reframe this post：{post}"
        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': [{"role": "user", "content": prompt}]
        }
        
        success = False
        
        # 尝试每个API端点
        for url in api_urls:
            try:
                print(f"  🔍 尝试: {url}")
                r = requests.post(url, json=payload, headers=headers, timeout=20)
                
                if r.status_code == 200:
                    data = r.json()
                    if 'choices' in data and len(data['choices']) > 0:
                        ai_reply = data['choices'][0]['message']['content']
                        print(f"  ✅ 成功! AI回复: {ai_reply[:100]}...")
                        results.append({'Post': post, 'AI_Reframe': ai_reply})
                        success = True
                        break
                    else:
                        print(f"  ⚠️  响应格式异常: {data}")
                else:
                    print(f"  ❌ 状态码 {r.status_code}: {r.text[:100]}...")
                    
            except Exception as e:
                print(f"  💥 异常: {str(e)}")
            
            time.sleep(1)  # 避免请求过于频繁
        
        if not success:
            print(f"  🚫 所有端点都失败了")
            results.append({'Post': post, 'AI_Reframe': '[API全部请求失败]'})
    
    # 输出结果
    print("\n" + "=" * 50)
    print("📊 测试结果:")
    print("-" * 30)
    
    for i, result in enumerate(results, 1):
        print(f"{i}. 原文: {result['Post']}")
        print(f"   AI重构: {result['AI_Reframe']}")
        print()
    
    # 统计成功率
    successful = sum(1 for r in results if not r['AI_Reframe'].startswith('[API全部请求失败]'))
    print(f"🎯 成功率: {successful}/{len(results)} ({successful/len(results)*100:.1f}%)")
    
    if successful > 0:
        print("🎉 API测试成功！可以正常使用！")
    else:
        print("⚠️  所有测试都失败了，请检查配置")

# 运行测试
if __name__ == "__main__":
    test_working_api()
