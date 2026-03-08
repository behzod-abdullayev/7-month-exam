import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/users/entities/user.entity";

import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findOrCreate(userData: Partial<User>): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (foundUser) {
      return foundUser;
    }
    if (!userData.username) {
      const emailBase = userData.email?.split("@")[0] ?? "user";
      userData.username = `${emailBase}_${Math.floor(Math.random() * 1000)}`;
    }
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.userRepository.update(userId, {
      refreshToken: refreshToken,
    });
  }
}
