export interface Record {
  AD_Client_ID: number
  AD_Org_ID: number
  CM_Call_ID: number
  Created: string
  CreatedBy: number
  IsActive: boolean
  IsDeleted: boolean
  Updated: string
  UpdatedBy: number
  callID: string
  callStatus: string
  Direction: string
  callerNumber: string
  destinationNumber: string
  StartTime: string
  answerTime: string
  EndTime: string
  hangupBy: string
  totalDuration: number
  holdingDuration: number
  recordingUrl: string
  objectId: number
  transactionID: string
  AD_User_ID: number
  EventType: string
  UserName: string
  CustomerName: string
  Tag?: string
  Note?: string
  IsWriteRecord: boolean
}

export class HistoryCallModel {
  records: Record[];

  constructor(records: Record[]) {
    this.records = records;
  }

  static fromJson(json: any): HistoryCallModel {
    return new HistoryCallModel(json.records);
  }
}
