export class MSchoolDto {
  schoolCode: string;
  schoolName: string;
  principalName: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  logo?: any;
}

export class UpdateSchoolDto extends MSchoolDto {}

export class UpdateSchoolLogoDto {
  logo: any;
  authLstEdt?: string;
}
