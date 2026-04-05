import { IsOptional, IsString, IsInt } from 'class-validator';
import { CreateEnquiryDto } from './create-enquiry.dto';

export class UpdateEnquiryDto extends CreateEnquiryDto {
  @IsInt()
  enquiryId: number;

  @IsOptional()
  @IsString()
  authLstEdt?: string;
}
