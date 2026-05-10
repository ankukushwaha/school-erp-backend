import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSyllabusDto {
  @IsInt()
  @IsNotEmpty()
  classId: number;

  @IsInt()
  @IsNotEmpty()
  subjectId: number;

  @IsString()
  @IsOptional()
  termName?: string;

  @IsInt()
  @IsOptional()
  totalTopics?: number;

  @IsInt()
  @IsOptional()
  completedTopics?: number;

  @IsString()
  @IsOptional()
  document?: string;
  
  @IsString()
  @IsOptional()
  academicYear?: string;
  
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateSyllabusDto extends CreateSyllabusDto {}
