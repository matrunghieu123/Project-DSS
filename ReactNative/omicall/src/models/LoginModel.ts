export interface UserInfo {
  AD_User_ID: number;
  UserName: string;
  Email: string;
  Employee_ID: string;
  IsUserAdmin: string;
  IsUserSystem: string;
  ImageUrl: string;
}

export interface CompanyInfo {
  Client_ID: number;
  ClientName: string;
  ClientValue: string;
  IsMoreCurrency: string;
  C_CurrencyDefault_ID: string;
  MaterialPolicy: string;
  C_Element_ID: string;
  IsGroup: string;
}

export interface OrgAccessInfo {
  Org_ID: any;
  Org_Name: string;
  Permission: string;
  PermissionType: string;
  Org_Value?: string;
}

export interface RolesInfo {
  Role_ID: number;
  Role_Name: string;
}

export class LoginModel {
  token: string;
  UserInfo: UserInfo;
  CompanyInfo: CompanyInfo;
  OrgAccessInfo: OrgAccessInfo[];
  RolesInfo: RolesInfo[];

  constructor(
    token: string,
    UserInfo: UserInfo,
    CompanyInfo: CompanyInfo,
    OrgAccessInfo: OrgAccessInfo[],
    RolesInfo: RolesInfo[],
  ) {
    this.token = token;
    this.UserInfo = UserInfo;
    this.CompanyInfo = CompanyInfo;
    this.OrgAccessInfo = OrgAccessInfo;
    this.RolesInfo = RolesInfo;
  }

  static fromJson(json: any): LoginModel {
    return new LoginModel(
      json.token,
      json.UserInfo,
      json.CompanyInfo,
      json.OrgAccessInfo,
      json.RolesInfo,
    );
  }
}
