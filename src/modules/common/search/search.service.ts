import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { CommonSearchResponseDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly repo: SearchRepository) {}

  async searchAsync(
    schemaName: string,
    tableName: string,
    columnId: string,
    displayColumns: string,
    displayName: string,
    searchTerm: string,
    otherCondition?: string,
    sortBy?: string,
  ): Promise<CommonSearchResponseDto> {
    return this.repo.searchAsync(
      schemaName,
      tableName,
      columnId,
      displayColumns,
      displayName,
      searchTerm || '',
      otherCondition,
      sortBy,
    );
  }
}
