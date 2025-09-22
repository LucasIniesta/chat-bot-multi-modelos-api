import { registerAs } from '@nestjs/config';

export default registerAs('model', () => ({
  openAi: process.env.API_KEY_OPENAI,
  claude: process.env.API_KEY_CLAUDE,
}));
