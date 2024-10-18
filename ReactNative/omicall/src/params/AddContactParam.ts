export class AddContactParam {
  private readonly AD_Org_ID: string;
  private readonly AD_Gender_ID: string;
  private readonly Name: string;
  private readonly Phone: string;
  private readonly Email: string;
  private readonly HR_Employee_ID: string;
  private readonly Note: string;

  constructor(
    AD_Org_ID: string,
    AD_Gender_ID: string,
    Name: string,
    Phone: string,
    Email: string,
    HR_Employee_ID: string,
    Note: string,
  ) {
    this.AD_Org_ID = AD_Org_ID;
    this.AD_Gender_ID = AD_Gender_ID;
    this.Name = Name;
    this.Phone = Phone;
    this.Email = Email;
    this.HR_Employee_ID = HR_Employee_ID;
    this.Note = Note;
  }

  public toObject() {
    return {
      AD_Org_ID: this.AD_Org_ID,
      AD_Gender_ID: this.AD_Gender_ID,
      Name: this.Name,
      Phone: this.Phone,
      Email: this.Email,
      HR_Employee_ID: this.HR_Employee_ID,
      Note: this.Note,
    };
  }
}
