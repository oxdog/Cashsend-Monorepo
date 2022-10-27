import moment from 'moment'

export const mongoTimestampToCalendar = (mongoTimestamp: string) =>
  moment.unix(Number(mongoTimestamp) / 1000).format('DD.MM.YY')
