export class CommonSearchRowDto {
  id: number;
  columns: { [key: string]: string };
}

export class CommonSearchResponseDto {
  displayName: string;
  headers: string[];
  data: CommonSearchRowDto[] = [];
}
