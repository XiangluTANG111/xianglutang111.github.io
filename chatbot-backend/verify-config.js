// Verify chatbot configuration
const persona = require('../xianglu-persona.json');

console.log('🔍 Chatbot Configuration Verification');
console.log('=====================================');

// Check if persona loads correctly
console.log('✅ Persona file loaded:', !!persona.persona);

// Check conversation starters
const starters = persona.persona.communication_style.conversation_starters;
console.log('\n📝 Conversation Starters:');
starters.forEach((starter, index) => {
  console.log(`${index + 1}. ${starter}`);
});

// Check key questions
const keyQuestions = persona.persona.communication_style.conversation_flow_rules.exploration_phase.key_questions;
console.log('\n❓ Key Questions:');
keyQuestions.forEach((question, index) => {
  console.log(`${index + 1}. ${question}`);
});

// Check proactive guidance
const proactiveGuidance = persona.persona.conversation_instructions.proactive_guidance;
console.log('\n🎯 Proactive Guidance:');
proactiveGuidance.forEach((guidance, index) => {
  console.log(`${index + 1}. ${guidance}`);
});

console.log('\n✅ Configuration verification complete!');
console.log('\n💡 If chatbot still asks old questions, try:');
console.log('1. Restart the chatbot service');
console.log('2. Clear any browser cache');
console.log('3. Check if there are other config files');

