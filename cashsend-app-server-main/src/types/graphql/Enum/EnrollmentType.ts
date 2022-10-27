import { registerEnumType } from 'type-graphql'

export enum EnrollmentType {
  REGULAR = 'regular',
  SCAN_AND_PAY = 'scan_and_pay',
  HOFLADEN = 'hofladen'
}

registerEnumType(EnrollmentType, {
  name: 'EnrollmentType',
  description: 'Type of Enrollment'
})
