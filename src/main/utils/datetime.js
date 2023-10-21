/* Convert date and time from UTC to Local */
export function UTC_to_local(date, time) {
  if (!date || !time) return '';
  if (date.substring(0, 4) == '0000') {
    return `${date} ${time}`;
  } else {
    //Если дата без разделителей, то добавляем их
    if (date.length === 8) {
      date = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    }
    //Если время без разделителей, то добавляем их
    if (time.length === 6) {
      time = `${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}`;
    }
    let datetime = new Date(`${date} ${time} UTC`);
    // return datetime.toLocaleString().replace(',', '');
    const offset = datetime.getTimezoneOffset();
    datetime = new Date(datetime.getTime() - offset * 60 * 1000);
    const s = datetime.toISOString();
    return `${s.substring(0, 10)} ${s.substring(11, 19)}`;
  }
}

/* Convert SAP Timestamp to date time format string */
export function timestamp_to_datetime(timestamp) {
  timestamp = timestamp.replace(/(\d{2})\.(\d{2})(\d)\.(\d)(\d{2})\.(\d{2})(\d)\.(\d)(\d{2})/g, '$1$2-$3$4-$5 $6:$7$8:$9');
  const date = timestamp.substring(0, 10);
  const time = timestamp.substring(11, 19);
  return { date, time };
}
