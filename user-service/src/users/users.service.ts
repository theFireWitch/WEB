import { Injectable,  UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
const JWT_SECRET2 = "topSecret123";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.userRepository.findOneBy({ email });

  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password);

  //   if (!isPasswordValid) {
  //     throw new Error('Invalid credentials');
  //   }

  //   const { password: _, ...result } = user;
  //   console.log('JWT_SECRET:', process.env.JWT_SECRET); 
    
  //   const accessToken = this.jwtService.sign(result);
  //   return { access_token: accessToken };
  // }
  async validateUser(email: string, password: string): Promise<any> {
  const user = await this.userRepository.findOneBy({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...result } = user;
    return {
      access_token: this.jwtService.sign(result),
    };
  }

  return null; // ⚠️ Якщо сюди потрапляємо, Nest.js може кинути помилку, якщо не оброблено
}
}