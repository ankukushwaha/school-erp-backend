import { Injectable } from '@nestjs/common';
import { EnquiryRepository } from './enquiry.repository';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';

@Injectable()
export class EnquiryService {
  constructor(private readonly repository: EnquiryRepository) {}

  async getAll() {
    return this.repository.getAllAsync();
  }

  async getById(id: number) {
    return this.repository.getByIdAsync(id);
  }

  async create(dto: CreateEnquiryDto) {
    return this.repository.createAsync(dto);
  }

  async update(dto: UpdateEnquiryDto) {
    return this.repository.updateAsync(dto);
  }

  async delete(id: number, authDel: string) {
    return this.repository.deleteAsync(id, authDel);
  }
}
