import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //#TODO: Apagar essa rota quando terminar, pois não será utilizada no futuro
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  //#TODO: Apagar essa rota quando terminar, pois não será utilizada no futuro
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch()
  update(
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(tokenPayload, updateUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @Delete()
  remove(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.usersService.remove(tokenPayload);
  }
}
