export interface Record {
  AD_Client_ID: number;
  AD_Org_ID: number;
  CM_Customer_ID: number;
  Created: string;
  CreatedBy: number;
  IsActive: boolean;
  Updated: string;
  UpdatedBy: number;
  Name: string;
  Email: string;
  isPublic: boolean;
  HR_Employee_ID?: number;
  DayOffDebt: number;
  isPersonal: boolean;
  lstSource: string;
  IsSendMail: boolean;
  IsSendSMS: boolean;
  IsWriteRecord: boolean;
  Value?: string;
  TaxCode?: string;
  HM_Province_ID?: number;
  HM_District_ID?: number;
  DateIssue?: string;
  Name2?: string;
  CM_CustomerGroup_ID?: number;
  CM_CommonLine_01_ID?: number;
  CM_CommonLine_04_ID?: number;
  CM_CommonLine_05_ID?: number;
  DebtMoney?: number;
  HM_Country_ID?: number;
  AD_Gender_ID?: string;
}

export class ContactModel {
  records: Record[];

  constructor(records: Record[]) {
    this.records = records;
  }

  static fromJson(json: any): ContactModel {
    return new ContactModel(json.records);
  }
}
