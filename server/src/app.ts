import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import candidateRoutes from './routes/candidateRoutes';
import interviewRoutes from './routes/interviewRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import aiRoutes from './routes/aiRoutes';
import notificationRoutes from './routes/notificationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import companyRoutes from './routes/companyRoutes';
import uploadRoutes from './routes/uploadRoutes';
import workflowRoutes from './routes/workflowRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [clientUrl].filter(Boolean) as string[];

const isAllowedOrigin = (origin: string | undefined) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, origin || true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.options('*', cors({ 
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, origin || true);
    }
    return callback(new Error('Not allowed by CORS'));
  }, 
  credentials: true 
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(morgan('tiny'));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(errorHandler);

export default app;
