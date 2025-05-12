import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('test')
  test() {
  return 'Test OK';
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() userData: { email: string; password: string }) {
    const user = await this.usersService.validateUser(userData.email, userData.password);
    if (!user) {
      return { message: 'Invalid credentials', success: false };
    }
    return { message: 'Login successful', success: true, user };
  }
}