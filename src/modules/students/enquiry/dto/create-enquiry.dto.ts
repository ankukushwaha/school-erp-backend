import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';

export class CreateEnquiryDto {
  @IsOptional()
  @IsString()
  enquiryNo?: string;

  @IsString()
  studentName: string;

  @IsOptional()
  @IsString()
  studentMobile?: string;

  @IsOptional()
  @IsString()
  studentEmail?: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentMobile?: string;

  @IsOptional()
  @IsString()
  parentEmail?: string;

  @IsOptional()
  @IsString()
  previousSchool?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsInt()
  stateId?: number;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsInt()
  assignedTo?: number;

  @IsOptional()
  @IsDateString()
  followupDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  authAdd?: string;
}
