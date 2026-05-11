import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSyllabusTopicDto {
  @IsInt()
  @IsNotEmpty()
  syllabusChapterId: number;

  @IsString()
  @IsNotEmpty()
  topicName: string;

  @IsString()
  @IsOptional()
  topicContent?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class UpdateSyllabusTopicDto {
  @IsInt()
  @IsOptional()
  syllabusChapterId?: number;

  @IsString()
  @IsOptional()
  topicName?: string;

  @IsString()
  @IsOptional()
  topicContent?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
