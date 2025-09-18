import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER || 'http://localhost:3000',
  audience: process.env.JWT_AUDIENCE || 'http://localhost:3000',
  ttl: Number(process.env.JWT_TTL) || 3600,
}));
