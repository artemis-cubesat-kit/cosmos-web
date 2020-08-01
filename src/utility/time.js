import dayjs from 'dayjs';

/**
 * Convert MJD to human readable UTC date
 *
 * @param {Number} mjd MJD to convert
 * @returns {String} UTC date string
 */
export function mjdToString(mjd) {
  return dayjs
    .unix((((mjd + 2400000.5) - 2440587.5) * 86400.0))
    .utc()
    .format('YYYY-MM-DDTHH:mm:ss');
}

/**
 * Convert a dayjs date to MJD
 *
 * @param {dayjs} date dayjs object
 * @returns {Number} MJD date
 */
export function dateToMJD(date) {
  return (date.unix() / 86400.0) + 2440587.5 - 2400000.5;
}

/**
 * Convert MJD to a JavaScript date
 *
 * @param {Number} mjd Number to conver tto JavaScript date
 * @returns {Date} JavaScript date object
 */
export function MJDtoJavaScriptDate(mjd) {
  return dayjs
    .unix((((mjd + 2400000.5) - 2440587.5) * 86400.0))
    .toDate();
}

/**
 * Calculate the difference between the current time and the date provided, returning
 * the difference as a dayjs object. If the difference is over a day, then a string is returned.
 *
 * @param {dayjs object} date
 */
export function getDiff(date, countdown = false) {
  let futureTime = dayjs();
  let pastTime = date;

  if (date > dayjs() && countdown) {
    futureTime = date;
    pastTime = dayjs();
  }

  if (typeof date !== 'string' && futureTime.diff(pastTime, 'day') < 1) {
    const hour = futureTime.diff(pastTime, 'hour');
    const minute = futureTime.diff(pastTime, 'minute') % 60;
    const second = futureTime.diff(pastTime, 'second') % 60;

    if (countdown && hour === 0 && minute === 0 && second === 0) {
      return 'Finished';
    }

    return dayjs().set('hour', hour).set('minute', minute).set('second', second);
  }

  return 'Over a day';
}
