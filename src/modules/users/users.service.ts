import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async create(user: any) {
    if (user.userPassword) {
      user.userPassword = await bcrypt.hash(user.userPassword, 10);
    }
    return this.repo.createAsync(user);
  }

  async getAll() {
    return this.repo.getAllAsync();
  }

  async getById(id: number) {
    const user = await this.repo.getByIdAsync(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, user: any) {
    user.userId = id;
    if (user.userPassword) {
      user.userPassword = await bcrypt.hash(user.userPassword, 10);
    }
    const success = await this.repo.updateAsync(user);
    if (!success) throw new BadRequestException('Update failed');
    return 'User updated successfully';
  }

  async delete(id: number) {
    const success = await this.repo.deleteAsync(id);
    if (!success) throw new BadRequestException('Delete failed');
    return 'User deleted successfully';
  }
}
