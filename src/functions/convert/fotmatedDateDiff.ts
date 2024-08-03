import moment from 'moment-timezone'

export function getFormatedDateDiff(diff: number) {
  const d = moment.duration(diff)
  return `${d.years() > 0 ? d.years() + ' years, ' : ''}${d.months() > 0 ? d.months() + ' months, ' : ''}${
    d.days() > 0 ? d.days() + ' days, ' : ''
  }${d.hours() > 0 ? d.hours() + ' hours, ' : ''}${d.minutes()} minutes`
}
