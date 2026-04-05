import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { CommonSearchResponseDto, CommonSearchRowDto } from './dto/search.dto';

@Injectable()
export class SearchRepository {
  constructor(private readonly db: DatabaseService) {}

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
    const query = `
      SELECT * FROM search.usp_common_search(
        $1, $2, $3, $4, $5, $6, $7
      )
    `;
    const params = [
      schemaName,
      tableName,
      columnId,
      displayColumns,
      searchTerm,
      otherCondition || null,
      sortBy || null,
    ];

    const result = await this.db.query(query, params);

    const response = new CommonSearchResponseDto();
    response.displayName = displayName;
    response.headers = displayColumns.split(',').map((x) => x.trim());

    for (const row of result) {
      const jsonData = typeof row.result === 'string' ? JSON.parse(row.result) : row.result;
      
      const dict: { [key: string]: string } = {};
      for (const header of response.headers) {
        dict[header] = jsonData && jsonData[header] !== undefined ? jsonData[header].toString() : '';
      }

      response.data.push({
        id: parseInt(row.id, 10),
        columns: dict,
      } as CommonSearchRowDto);
    }

    return response;
  }
}
