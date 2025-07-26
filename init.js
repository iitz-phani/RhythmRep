#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Initializing RhythmRep Fitness App...\n');

// Check if database exists
if (!existsSync('fitness.db')) {
  console.log('📊 Creating database...');
  try {
    execSync('npm run db:push', { stdio: 'inherit' });
    console.log('✅ Database created successfully');
  } catch (error) {
    console.error('❌ Failed to create database:', error.message);
    process.exit(1);
  }
}

// Seed the database
console.log('\n🌱 Seeding database...');
try {
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.error('❌ Failed to seed database:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup complete! Starting the application...\n');
console.log('📱 The app will be available at: http://localhost:5000');
console.log('🔄 Press Ctrl+C to stop the server\n');

// Start the development server
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
} 