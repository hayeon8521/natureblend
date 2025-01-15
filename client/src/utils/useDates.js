const dateFormat = function(value, format) {
  let date = value == null ? new Date() : new Date(value);

  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);

  let hour = ('0' + date.getHours()).slice(-2);
  let min = ('0' + date.getMinutes()).slice(-2);
  let sec = ('0' + date.getSeconds()).slice(-2);

  let result = format.replace('yyyy', year)
                     .replace('MM', month)
                     .replace('dd', day)
                     .replace('hh', hour)
                     .replace('mm', min)
                     .replace('ss', sec);
  return result;
}

export default {
  dateFormat,
}