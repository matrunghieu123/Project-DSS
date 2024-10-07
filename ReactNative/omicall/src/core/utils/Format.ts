export class Format {
  static formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('-');
    return `Ngày ${day} Tháng ${month} Năm ${year}`;
  };

  static formatTime = (time: string) => {
    const times = time.split(':');
    const hour = times[0];
    const minute = times[1];
    return `${hour}:${minute}`;
  }
}
