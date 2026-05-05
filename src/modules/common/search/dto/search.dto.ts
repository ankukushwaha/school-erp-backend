export class CommonSearchRowDto {
  id: number = 0;
  columns: { [key: string]: string } = {};
}

export class CommonSearchResponseDto {
  displayName: string = "";
  headers: string[] = []  ;
  data: CommonSearchRowDto[] = [];
}
