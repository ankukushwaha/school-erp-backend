import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('common-search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Get()
  async search(
    @Query('schemaName') schemaName: string,
    @Query('tableName') tableName: string,
    @Query('columnId') columnId: string,
    @Query('displayColumns') displayColumns: string,
    @Query('displayName') displayName: string,
    @Query('searchTerm') searchTerm: string,
    @Query('otherCondition') otherCondition?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.service.searchAsync(
      schemaName,
      tableName,
      columnId,
      displayColumns,
      displayName,
      searchTerm,
      otherCondition,
      sortBy,
    );
  }
}
