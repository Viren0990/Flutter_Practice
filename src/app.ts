import express, { Application, Request, Response } from 'express';
import path from 'node:path';
import { pool, initDatabase } from './db';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve frontend

// Initialize database


// Get current gold rate
app.get('/api/gold-rate', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gold_rates ORDER BY last_updated DESC LIMIT 1'
    );
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gold rate'
    });
  }
});

// Update gold rate
app.put('/api/gold-rate', async (req: Request, res: Response) => {
  try {
    const { price } = req.body;
    
    console.log('📝 Received update request:', { price }); // Add logging
    
    if (!price || Number.isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }

    const result = await pool.query(
      `UPDATE gold_rates 
       SET price = $1, last_updated = CURRENT_TIMESTAMP 
       WHERE id = (SELECT id FROM gold_rates ORDER BY last_updated DESC LIMIT 1)
       RETURNING *`,
      [price]
    );

    console.log('✅ Update successful:', result.rows[0]); // Add logging

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Update error:', error); // Add logging
    res.status(500).json({
      success: false,
      message: 'Error updating gold rate'
    });
  }
});
// Serve frontend
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
