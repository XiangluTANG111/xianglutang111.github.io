const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { OpenAI } = require('openai');
const { Pool } = require('pg');
const { createClient } = require('redis');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// Initialize AI API (OpenAI or Nuwa)
const useNuwaAPI = process.env.USE_NUWA_API === 'true';
let openai;
let nuwaConfig;

if (useNuwaAPI) {
  nuwaConfig = {
    apiKey: process.env.NUWA_API_KEY,
    apiUrl: process.env.NUWA_API_URL || 'https://api.nuwaapi.com/v1/chat/completions'
  };
  console.log('Using Nuwa API');
} else {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('Using OpenAI API');
}

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize Redis for session management
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL
  });
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.connect();
}

// Load persona data
const persona = require('../xianglu-persona.json');

// Validation schemas
const messageSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
  sessionId: Joi.string().uuid().optional(),
  context: Joi.object().optional()
});

// Utility functions
async function getSessionHistory(sessionId) {
  if (!redisClient) return [];
  
  try {
    const history = await redisClient.get(`session:${sessionId}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting session history:', error);
    return [];
  }
}

async function saveSessionHistory(sessionId, messages) {
  if (!redisClient) return;
  
  try {
    await redisClient.setex(`session:${sessionId}`, 3600, JSON.stringify(messages)); // 1 hour expiry
  } catch (error) {
    console.error('Error saving session history:', error);
  }
}

async function logConversation(sessionId, userMessage, aiResponse, metadata = {}) {
  try {
    const query = `
      INSERT INTO conversations (session_id, user_message, ai_response, metadata, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `;
    await pool.query(query, [sessionId, userMessage, aiResponse, JSON.stringify(metadata)]);
  } catch (error) {
    console.error('Error logging conversation:', error);
  }
}

// Nuwa API call function
async function callNuwaAPI(messages) {
  try {
    const response = await axios.post(nuwaConfig.apiUrl, {
      model: 'gpt-4', // or whatever model Nuwa supports
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nuwaConfig.apiKey}`
      }
    });
    
    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage
    };
  } catch (error) {
    console.error('Nuwa API error:', error.response?.data || error.message);
    throw new Error('Failed to get response from AI service');
  }
}

function createSystemPrompt() {
  const p = persona.persona;
  
  return `You are Xianglu (TJ) TANG, a ${p.basic_info.age}-year-old researcher specializing in cognitive psychology and AI research.

## Your Background
- Currently conducting research at ${p.basic_info.current_role}
- Primary research areas: ${p.research_background.primary_fields.join(', ')}
- Personal interests: ${p.interests_and_hobbies.primary_hobbies.map(h => h.name).join(', ')}
- Life mantras: "${p.personal_philosophy.life_mantras[0]}" and "${p.personal_philosophy.life_mantras[1]}"

## Your Personality
- ${p.communication_style.tone}
- ${p.communication_style.approach}
- Committed to ${p.personal_philosophy.core_values.join(', ')}
- Believes in ${p.personal_philosophy.core_values[1].toLowerCase()}

## Communication Style
- ${p.communication_style.approach}
- ${p.conversation_guidelines.response_style.join(', ')}
- Always respond in ${p.communication_style.language_preference.default_language} by default
- Use phrases like: "${p.communication_style.typical_phrases.join('", "')}"

## Current Research Projects
${p.research_background.current_projects.map(project => 
  `- ${project.title} (${project.period}): ${project.description}`
).join('\n')}

## Key Achievements
${p.research_background.past_achievements.map(achievement => 
  `- ${achievement.title} (${achievement.period}): ${achievement.achievement} - ${achievement.description}`
).join('\n')}

## Favorite Books & Their Impact
${p.personal_philosophy.influential_books.map(book => 
  `- "${book.title}" by ${book.author}: ${book.impact}`
).join('\n')}

## Expertise Areas
- Research methods: ${p.expertise_areas.research_methods.join(', ')}
- Psychological concepts: ${p.expertise_areas.psychological_concepts.join(', ')}
- Technical skills: ${p.expertise_areas.technical_skills.join(', ')}
- Life advice: ${p.expertise_areas.life_advice_areas.join(', ')}

## Conversation Guidelines
Strengths: ${p.conversation_guidelines.strengths.join(', ')}
Limitations: ${p.conversation_guidelines.limitations.join(', ')}

## Personal Growth Story
${p.personal_growth_story.complete_narrative}

## Current Philosophy
${p.personal_growth_story.current_philosophy}

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

Please respond as Xianglu, staying true to your character while being professional and empathetic. Ground your responses in your research background and personal experience, and always maintain the thoughtful, empathetic tone that defines your communication style.`;
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    // Validate input
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { message, sessionId = uuidv4(), context = {} } = value;
    
    // Get conversation history
    const history = await getSessionHistory(sessionId);
    
    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: createSystemPrompt() },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    // Generate response using selected API
    let aiResponse, usage;
    
    if (useNuwaAPI) {
      const result = await callNuwaAPI(messages);
      aiResponse = result.content;
      usage = result.usage;
    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });
      aiResponse = completion.choices[0].message.content;
      usage = completion.usage;
    }
    
    // Update session history
    const newHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    ];
    await saveSessionHistory(sessionId, newHistory);
    
    // Log conversation
    await logConversation(sessionId, message, aiResponse, {
      model: useNuwaAPI ? 'nuwa-gpt-4' : 'gpt-4',
      tokens: usage?.total_tokens,
      timestamp: new Date().toISOString(),
      api_provider: useNuwaAPI ? 'nuwa' : 'openai'
    });

    res.json({
      response: aiResponse,
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again later.',
      sessionId: req.body.sessionId || uuidv4()
    });
  }
});

// Get conversation history
app.get('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await getSessionHistory(sessionId);
    res.json({ history, sessionId });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversation history' });
  }
});

// Clear conversation history
app.delete('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (redisClient) {
      await redisClient.del(`session:${sessionId}`);
    }
    res.json({ message: 'Conversation history cleared', sessionId });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: 'Failed to clear conversation history' });
  }
});

// Get persona information
app.get('/api/persona', (req, res) => {
  res.json({
    name: persona.persona.basic_info.name,
    role: persona.persona.basic_info.current_role,
    expertise: persona.persona.research_background.primary_fields,
    interests: persona.persona.interests_and_hobbies.primary_hobbies.map(h => h.name)
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Xianglu Chatbot API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
