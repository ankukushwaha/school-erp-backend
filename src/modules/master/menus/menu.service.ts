import { Injectable } from '@nestjs/common';
import { MenuRepository } from './menu.repository';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  async getMenuTree() {
    return this.menuRepository.getMenuTreeAsync();
  }
}
