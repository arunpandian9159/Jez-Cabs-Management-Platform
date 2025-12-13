import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  uri:
    process.env.MONGODB_URI ||
    'mongodb://admin:admin@localhost:27017/jezcabs?authSource=admin',
}));
