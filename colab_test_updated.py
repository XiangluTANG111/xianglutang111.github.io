# Google Colab 测试代码 - 更新版
# 基于您提供的参考代码

import requests
import json

# 🔑 API配置
api_key = "sk-qu856g9uNAIfudyPH9sDBDgwp9YldlcGRnk4UEndo6gKSpbk"

# 🌐 测试多个API端点
api_urls = [
    "https://api.nuwaapi.com/v1/chat/completions",
    "https://api.nuwaapi.com/v1",
    "https://api.nuwaapi.com"
]

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

def test_api_endpoint(url):
    """测试单个API端点"""
    print(f"\n🔍 测试端点: {url}")
    print("-" * 50)
    
    # 准备测试数据
    payload = {
        'model': 'gpt-3.5-turbo',
        'messages': [
            {"role": "user", "content": "你好，请简单介绍一下自己"}
        ]
    }
    
    try:
        print("📤 发送请求...")
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"📊 状态码: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ 请求成功！")
            try:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    content = data['choices'][0]['message']['content']
                    print(f"🤖 AI回复: {content}")
                    return True, content
                else:
                    print("⚠️  响应格式异常")
                    print(f"响应内容: {data}")
                    return False, str(data)
            except json.JSONDecodeError:
                print("⚠️  JSON解析失败")
                print(f"原始响应: {response.text[:200]}...")
                return False, response.text[:200]
        else:
            print("❌ 请求失败")
            print(f"错误信息: {response.text}")
            return False, response.text
            
    except requests.exceptions.Timeout:
        print("⏰ 请求超时")
        return False, "Timeout"
    except requests.exceptions.ConnectionError:
        print("🔌 连接错误")
        return False, "Connection Error"
    except Exception as e:
        print(f"💥 未知错误: {str(e)}")
        return False, str(e)

def test_streaming_response(url):
    """测试流式响应"""
    print(f"\n🌊 测试流式响应: {url}")
    print("-" * 50)
    
    payload = {
        'model': 'gpt-3.5-turbo',
        'messages': [
            {"role": "user", "content": "请写一首关于春天的短诗"}
        ],
        'stream': True
    }
    
    try:
        print("📤 发送流式请求...")
        response = requests.post(url, headers=headers, json=payload, stream=True, timeout=30)
        
        if response.status_code == 200:
            print("✅ 流式连接成功！")
            print("📝 流式响应内容:")
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
            return True, full_content
        else:
            print(f"❌ 流式请求失败: {response.status_code}")
            print(f"错误: {response.text}")
            return False, response.text
            
    except Exception as e:
        print(f"💥 流式测试错误: {str(e)}")
        return False, str(e)

def main():
    """主测试函数"""
    print("🚀 Nuwa API 测试开始")
    print("=" * 60)
    print(f"🔑 API密钥: {api_key[:10]}...")
    print(f"🌐 测试端点数量: {len(api_urls)}")
    
    results = []
    
    # 测试所有端点
    for i, url in enumerate(api_urls, 1):
        print(f"\n📍 测试 {i}/{len(api_urls)}")
        success, content = test_api_endpoint(url)
        results.append({
            'url': url,
            'success': success,
            'content': content
        })
    
    # 测试流式响应（使用第一个成功的端点）
    successful_urls = [r['url'] for r in results if r['success']]
    if successful_urls:
        print(f"\n🌊 使用成功端点测试流式响应: {successful_urls[0]}")
        test_streaming_response(successful_urls[0])
    
    # 输出总结
    print("\n" + "=" * 60)
    print("📊 测试结果总结:")
    print("-" * 30)
    
    for i, result in enumerate(results, 1):
        status = "✅ 成功" if result['success'] else "❌ 失败"
        print(f"{i}. {result['url']} - {status}")
    
    successful_count = sum(1 for r in results if r['success'])
    print(f"\n🎯 成功率: {successful_count}/{len(results)} ({successful_count/len(results)*100:.1f}%)")
    
    if successful_count > 0:
        print("🎉 API测试成功！可以正常使用！")
    else:
        print("⚠️  所有端点都失败了，请检查API密钥和网络连接")

# 运行测试
if __name__ == "__main__":
    main()
