import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection first
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection test passed');
    
    // Create table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS gold_rates (
        id SERIAL PRIMARY KEY,
        metal VARCHAR(50) NOT NULL,
        purity VARCHAR(10) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(createTableQuery);
    console.log('✅ Table created/verified');
    
    // Check if data exists
    const checkData = await pool.query('SELECT COUNT(*) FROM gold_rates');
    console.log(`📊 Current records: ${checkData.rows[0].count}`);
    
    if (checkData.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO gold_rates (metal, purity, unit, price, currency)
        VALUES ('Gold', '24K', '10 grams', 72500, 'INR')
      `);
      console.log('✅ Initial data inserted');
    }
    
    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}
