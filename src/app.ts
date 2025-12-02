import express, { Application, Request, Response } from 'express';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hardcoded gold rate data
const goldRate = {
  metal: "Gold",
  purity: "24K",
  unit: "10 grams",
  price: 72500,
  currency: "INR",
  lastUpdated: new Date().toISOString()
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Gold Rate API', 
    endpoints: ['/api/gold-rate'] 
  });
});

app.get('/api/gold-rate', (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: goldRate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;
