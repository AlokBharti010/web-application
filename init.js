// ============================================================
// SKILLHUB DATABASE INITIALIZATION CLI SCRIPT
// Usage: node src/db/init.js [--seed]
// ============================================================

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { DB_CONFIG } = require('../config/db');

async function runCli() {
  console.log('🔄 Connecting to MySQL server at', `${DB_CONFIG.host}:${DB_CONFIG.port}...`);

  try {
    const rootConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password
    });

    console.log(`🔨 Creating database if not exists: \`${DB_CONFIG.database}\``);
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await rootConnection.end();

    const dbConnection = await mysql.createConnection(DB_CONFIG);

    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('📄 Applying schema DDL from schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      const statements = schemaSql
        .replace(/--.*$/gm, '')
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const sql of statements) {
        try {
          await dbConnection.query(sql);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.warn('  ⚠️ Statement notice:', err.message);
          }
        }
      }
      console.log('✅ Schema tables successfully created.');
    }

    const shouldSeed = process.argv.includes('--seed') || true;
    if (shouldSeed) {
      const seedPath = path.join(__dirname, 'seed.sql');
      if (fs.existsSync(seedPath)) {
        console.log('🌱 Populating initial seed data from seed.sql...');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        const seedStatements = seedSql
          .replace(/--.*$/gm, '')
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const sql of seedStatements) {
          try {
            await dbConnection.query(sql);
          } catch (err) {
            console.warn('  ⚠️ Seed notice:', err.message);
          }
        }
        console.log('✅ Seed data successfully inserted.');
      }
    }

    await dbConnection.end();
    console.log('🎉 SkillHub MySQL database initialized successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to initialize MySQL database:');
    console.error(err.message);
    console.log('\n💡 Tip: Verify that your MySQL server is running and check backend/.env');
    process.exit(1);
  }
}

runCli();
