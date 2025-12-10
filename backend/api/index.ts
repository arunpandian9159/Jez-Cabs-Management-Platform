// Vercel serverless function entry point
// Re-exports the handler from main.ts which includes all NestJS configuration
import handler from '../src/main';

export default handler;
