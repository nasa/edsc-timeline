import { padStart } from 'lodash'

import { MONTHS } from '../constants'

export const formatFullTime = (date) => `${padStart(date.getUTCHours(), 2, '0')}:${padStart(date.getUTCMinutes(), 2, '0')}:${padStart(date.getUTCSeconds(), 2, '0')}`
export const formatTime = (date) => `${padStart(date.getUTCHours(), 2, '0')}:${padStart(date.getUTCMinutes(), 2, '0')}`
export const formatDay = (date) => padStart(date.getUTCDate(), 2, '0')
export const formatMonth = (date) => MONTHS[date.getUTCMonth()]
export const formatDate = (date) => `${formatMonth(date)} ${formatDay(date)}`
export const formatYear = (date) => `${date.getUTCFullYear()}`
