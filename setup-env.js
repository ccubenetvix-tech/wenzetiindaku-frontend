#!/usr/bin/env node

/**
 * Environment Setup Script
 * This script helps you create the .env file for local development
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('📝 Current contents:');
  console.log('─'.repeat(50));
  console.log(fs.readFileSync(envPath, 'utf8'));
  console.log('─'.repeat(50));
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      createEnvFile();
    } else {
      console.log('✅ Keeping existing .env file');
    }
    rl.close();
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  const envContent = `# Environment Configuration
# Set to 'development' for local backend, 'production' for deployed backend
VITE_ENVIRONMENT=development

# Backend URLs
VITE_LOCAL_BACKEND_URL=http://localhost:5000/api
VITE_PRODUCTION_BACKEND_URL=https://wenzetiindaku-backend-ccubenetvix-tech2481-dp5p5n4l.leapcell.dev/api

# You can also override the backend URL directly (highest priority)
# VITE_API_URL=http://localhost:5000/api
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Contents:');
    console.log('─'.repeat(50));
    console.log(envContent);
    console.log('─'.repeat(50));
    console.log('🚀 You can now run: npm run dev');
    console.log('💡 To switch to production, change VITE_ENVIRONMENT=production');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
}
