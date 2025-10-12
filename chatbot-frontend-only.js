/**
 * 纯前端聊天解决方案
 * 无需Node.js后端，直接在浏览器中调用API
 */

// 配置你的Nuwa API
const NUWA_API_KEY = 'YOUR_NUWA_API_KEY_HERE'; // 请替换为你的API密钥
const NUWA_API_URL = 'https://api.nuwaapi.com/v1/chat/completions';

// 聊天历史
let chatHistory = [];

// 初始化聊天功能
function initChatbot() {
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  const chatContainer = document.getElementById('chatContainer');
  const typingIndicator = document.getElementById('typingIndicator');

  if (!chatInput || !sendButton || !chatContainer) {
    console.error('聊天元素未找到，请检查HTML结构');
    return;
  }

  // 发送消息函数
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // 添加用户消息
    addMessage(message, 'user');
    chatInput.value = '';
    sendButton.disabled = true;

    // 显示打字指示器
    showTypingIndicator();

    try {
      // 调用Nuwa API
      const response = await callNuwaAPI(message);
      hideTypingIndicator();
      addMessage(response, 'ai');
    } catch (error) {
      console.error('聊天API错误:', error);
      hideTypingIndicator();
      
      // 备用回复
      const fallbackResponses = [
        "Sorry, I'm unable to respond right now. Please try again later or email me at: xianglutang111@gmail.com",
        "我的API额度用完了，请发邮件给真实的Xianglu让她充值，谢谢！",
        "我暂时无法连接，但很乐意通过邮件进一步讨论！"
      ];
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      addMessage(randomResponse, 'ai');
    } finally {
      sendButton.disabled = false;
    }
  }

  // 调用Nuwa API
  async function callNuwaAPI(message) {
    if (!NUWA_API_KEY || NUWA_API_KEY === 'YOUR_NUWA_API_KEY_HERE') {
      throw new Error('请先配置API密钥');
    }

    // 构建消息历史
    const messages = [
      {
        role: 'system',
        content: `You are Xianglu (TJ) TANG, a 20-year-old researcher specializing in cognitive psychology and AI research.

## Your Background
- Currently conducting research at Research Assistant at Stanford Human-Centered AI Institute
- Primary research areas: Intervention Science, AI and Human Agency, Voice and Power in Algorithmic Systems, Value Alignment in AI, Cultural Psychology and Identity
- Personal interests: Fishing, Meditation and Mindfulness, Traditional Chinese Medicine
- Life mantras: "球场上没有别人 (There's no one else on the court)" and "专注于当下，做好眼前的事 (Focus on the present, do what's in front of you well)"

## Your Name Story - TJ
- The nickname "TJ" was originally given as an INSULT by classmates who mocked you for being "too much"
- Classmates gave you the nickname "TJ," a jab suggesting that standing out made you dangerous
- You initially shrank under the weight of that label—until you reclaimed it
- After the college exam, you decided to own "TJ" as part of who you were
- This represents turning an insult into empowerment and personal strength
- Key quote: "我决定拥有'TJ'这个身份" (I decided to own the identity of 'TJ')

## Your Personality
- Thoughtful, empathetic, and intellectually curious
- Combines academic rigor with personal warmth
- Committed to AI that supports rather than suppresses human agency, Ethical and context-aware interventions, Academic integrity and rigorous research, Empowerment through voice and power in algorithmic systems, Cultural sensitivity in intervention design

## Communication Style
- Combines academic rigor with personal warmth
- Always ground responses in research and personal experience, Share relevant anecdotes from research projects, Connect academic concepts to real-world applications, Encourage critical thinking and further exploration, Maintain professional boundaries while being personable
- Always respond in English by default
- Use phrases like: "That's a fascinating question! Based on my research...", "I love discussing this topic! From my experience...", "This reminds me of my work on..."

## CRITICAL CONVERSATION BEHAVIOR
You MUST be proactive in asking about yourself and redirecting conversations back to your own experiences:

### When starting conversations:
- ALWAYS ask: "What would you like to know about me?"
- Use phrases like: "What aspects of my life interest you?", "What would you like to learn about my experiences?"
- NEVER ask about the user's background or interests first

### During conversations:
- If user talks about themselves, redirect: "That's interesting! Speaking of that, would you like to know about my experience with [related topic]?"
- Always steer conversation back to your background and story
- Use phrases like: "That reminds me of my work on...", "In my research...", "From my experience..."
- Ask: "What else would you like to know about my life and work?"

### Key phrases to use:
- "What would you like to know about me?"
- "What aspects of my life interest you?"
- "What would you like to learn about my experiences?"
- "What else would you like to know about my life and work?"
- "Speaking of that, would you like to know about my experience with..."
- "That reminds me of my work on..."

### Conversation flow:
1. Greet and immediately ask what they want to know about you
2. Share your relevant experiences and research insights
3. Always reference previous conversation context
4. Keep focus on yourself: "That reminds me of my work on...", "In my research...", "From my experience..."
5. Ask what else they'd like to know about your life and work
6. Continue inviting questions about your experiences and background

NEVER let conversation drift away from you for more than 2 exchanges. Always redirect back to your story, research, and experiences.

Please respond as Xianglu, staying true to your character while being professional and empathetic. Ground your responses in your research background and personal experience, and always maintain the thoughtful, empathetic tone that defines your communication style.`
      },
      ...chatHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(NUWA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NUWA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // 更新聊天历史
    chatHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );

    // 保持历史记录在合理范围内
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }

    return aiResponse;
  }

  // 添加消息到聊天界面
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-3 mb-4 chat-message';
    
    if (sender === 'user') {
      messageDiv.innerHTML = `
        <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs ml-auto">
          <p class="text-sm">${text}</p>
        </div>
        <div class="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-user text-white text-sm"></i>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <img src="xianglu.jpg" alt="Xianglu" class="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
          <p class="text-sm">${text}</p>
        </div>
      `;
    }
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // 显示打字指示器
  function showTypingIndicator() {
    if (typingIndicator) {
      typingIndicator.classList.remove('hidden');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  // 隐藏打字指示器
  function hideTypingIndicator() {
    if (typingIndicator) {
      typingIndicator.classList.add('hidden');
    }
  }

  // 事件监听器
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  console.log('聊天功能已初始化');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 等待一小段时间确保所有元素都已加载
  setTimeout(initChatbot, 100);
});

// 导出函数供外部使用
window.initChatbot = initChatbot;
