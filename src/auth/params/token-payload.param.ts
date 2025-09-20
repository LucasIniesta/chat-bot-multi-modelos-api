import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { TokenPayloadDto } from '../dto/token-payload.dto';

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayloadDto => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request[REQUEST_TOKEN_PAYLOAD_KEY] as TokenPayloadDto;
  },
);
