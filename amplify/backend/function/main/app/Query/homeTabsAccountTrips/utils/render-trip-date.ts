import dayjs from 'dayjs'
import { DateFormat } from '../../../utils/enums/dateFormat'

export const renderTripDate = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): string => {
  let renderDate

  const startDateDay = startDate.format(DateFormat.D)
  const startDateMonth = startDate.format(DateFormat.MMMM)
  const startDateYear = startDate.format(DateFormat.YYYY)

  const endDateDay = endDate.format(DateFormat.D)
  const endDateMonth = endDate.format(DateFormat.MMMM)
  const endDateYear = endDate.format(DateFormat.YYYY)

  if (startDate.toString() === endDate.toString()) {
    // example case: SEPTEMBER 8, 2021
    renderDate = startDate.format(DateFormat.MMMM_D_YYYY)
  } else if (startDateMonth === endDateMonth && startDateYear === endDateYear) {
    // example case: SEPTEMBER 8-18, 2021
    renderDate = `${startDateMonth} ${startDateDay}-${endDateDay}, ${startDateYear}`
  } else if (startDateMonth !== endDateMonth && startDateYear === endDateYear) {
    // example case: OCTOBER 6 - NOVEMBER 6, 2021
    renderDate = `${startDateMonth} ${startDateDay} - ${endDateMonth} ${endDateDay}, ${startDateYear}`
  } else {
    // example case: DECEMBER 12, 2021 - FEBRUARY 18, 2022
    renderDate = `${startDate.format(DateFormat.MMMM_D_YYYY)} - ${endDate.format(DateFormat.MMMM_D_YYYY)}`
  }
  return renderDate
}
