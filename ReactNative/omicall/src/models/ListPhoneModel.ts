export interface Record {
  AD_Client_ID: number
  AD_Org_ID: number
  CM_PhoneNumber_ID: number
  Created: string
  CreatedBy: number
  IsActive: boolean
  IsDeleted: boolean
  Name: string
  Note: string
  Updated: string
  UpdatedBy: number
  Value: string
  IsDefault: boolean
  Action: string
  CallInID: string
  CallOutID: string
  IsWriteRecord: boolean
}


export class ListPhoneModel {
  records: Record[];

  constructor(records: Record[]) {
    this.records = records;
  }

  static fromJson(json: any): ListPhoneModel {
    return new ListPhoneModel(json.records);
  }
}
