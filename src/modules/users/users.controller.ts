import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async create(@Body() user: UserDto) {
    const id = await this.service.create(user);
    return { UserId: id };
  }

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() user: UserDto) {
    return this.service.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
