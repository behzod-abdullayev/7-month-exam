import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { email, password, ...rest } = createUserDto;

      const existingUser = await this.userRepository.findOne({ where: { email } });

      if (existingUser) throw new ConflictException(" Bu email bilan foydalanuvchi allaqachon mavjud");

      const newUser = this.userRepository.create({
        ...rest,
        email,
      });

      if (password) {
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
      }

      const savedUser = await this.userRepository.save(newUser);

      const { password: _, ...userWithoutPassword } = savedUser;

      return userWithoutPassword as User;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
