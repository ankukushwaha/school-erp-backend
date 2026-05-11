import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSyllabusChapterDto {
  @IsNotEmpty()
  @IsNumber()
  syllabusId: number;

  @IsNotEmpty()
  @IsString()
  chapterName: string;

  @IsOptional()
  @IsNumber()
  chapterOrder?: number;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

export class UpdateSyllabusChapterDto {
  @IsOptional()
  @IsNumber()
  syllabusId?: number;

  @IsOptional()
  @IsString()
  chapterName?: string;

  @IsOptional()
  @IsNumber()
  chapterOrder?: number;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
