// Test script to verify persona loading
const persona = require('../xianglu-persona.json');

console.log('=== Persona Loading Test ===');
console.log('Persona loaded successfully:', !!persona.persona);

console.log('\n=== Conversation Starters ===');
console.log('Number of conversation starters:', persona.persona.communication_style.conversation_starters.length);
console.log('First conversation starter:', persona.persona.communication_style.conversation_starters[0]);

console.log('\n=== Key Questions ===');
console.log('Number of key questions:', persona.persona.communication_style.conversation_flow_rules.exploration_phase.key_questions.length);
console.log('First key question:', persona.persona.communication_style.conversation_flow_rules.exploration_phase.key_questions[0]);

console.log('\n=== Proactive Guidance ===');
console.log('Proactive guidance phrases:', persona.persona.conversation_instructions.proactive_guidance);

console.log('\n=== Test Complete ===');

