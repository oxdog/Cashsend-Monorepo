import { ObjectId } from 'mongodb'
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { isServiceAuth } from '../middleware/isServiceAuth'
import { Partner, PartnerModel } from '../model/Partner'
import { Service_SinglePartnerResponse } from '../types/graphql/ObjectTypes/Service_SinglePartnerResponse'
import { Service_MultiPartnerResponse } from '../types/graphql/ObjectTypes/Service_MultiPartnerResponse'
import { Service_PartnerCreateInput } from '../types/graphql/InputTypes/Service_PartnerCreateInput'
import { Service_PartnerUpdateInput } from '../types/graphql/InputTypes/Service_PartnerUpdateInput'

// const cleanObjectFromNullAndEmptryString = (obj: any) =>
//   Object.fromEntries(
//     Object.entries(obj).filter(([_, v]) => v !== null && v !== '')
//   ) as any

const validateUpdate = (record: Service_PartnerUpdateInput) => {
  if (!record.email || record.email === '') {
    return false
  }
  if (!record.name || record.name === '') {
    return false
  }

  //could be more fancier I know, sufficient enough for now

  return true
}

@Resolver(Partner)
export class ServicePartnerResolver {
  @UseMiddleware(isServiceAuth)
  @Mutation(() => Service_SinglePartnerResponse)
  async service_createPartner(
    @Arg('record') record: Service_PartnerCreateInput
  ): Promise<Service_SinglePartnerResponse> {
    try {
      const isEmailTaken = await PartnerModel.exists({ email: record.email })

      if (isEmailTaken) {
        return {
          errors: [{ field: 'email', message: 'email already exists' }]
        }
      }
      const partner = await PartnerModel.create({ ...record })

      return { partner }
    } catch (e) {
      console.error('error', e)
      return {
        errors: [{ field: 'service_createPartner', message: 'Creation failed' }]
      }
    }
  }

  @UseMiddleware(isServiceAuth)
  @Mutation(() => Service_SinglePartnerResponse)
  async service_updatePartner(
    @Arg('_id') _id: ObjectId,
    @Arg('record') record: Service_PartnerUpdateInput
  ): Promise<Service_SinglePartnerResponse> {
    try {
      console.log('record', record)

      if (!validateUpdate(record)) {
        return {
          errors: [{ field: 'service_updatePartner', message: 'Faulty update' }]
        }
      }

      // let basicInfo = {
      //   name: record.name,
      //   email: record.email,
      //   connectID: record.connectID,
      //   about: record.about
      // }

      // basicInfo = cleanObjectFromNullAndEmptryString(basicInfo)

      // const location = cleanObjectFromNullAndEmptryString(record.location)
      // const contactPerson = cleanObjectFromNullAndEmptryString(
      //   record.contactPerson
      // )

      // let updateRecord = {}

      // if (basicInfo && Object.keys(basicInfo).length > 0) {
      //   updateRecord = {
      //     ...updateRecord,
      //     ...basicInfo
      //   }
      // }

      // if (location && Object.keys(location).length > 0) {
      //   updateRecord = {
      //     ...updateRecord,
      //     location: location
      //   }
      // }

      // if (contactPerson && Object.keys(contactPerson).length > 0) {
      //   updateRecord = {
      //     ...updateRecord,
      //     contactPerson
      //   }
      // }

      // console.log('basicInfo', basicInfo)
      // console.log('location', location, Object.keys(location).length === 0)
      // console.log('contactPerson', contactPerson)

      // console.log('updateRecord', updateRecord)

      const partner = await PartnerModel.findByIdAndUpdate(_id, record)

      if (!partner) throw new Error('Partner not found')

      return { partner }
    } catch (e) {
      console.error('error', e)
      return {
        errors: [{ field: 'service_updatePartner', message: 'Update failed' }]
      }
    }
  }

  @UseMiddleware(isServiceAuth)
  @Mutation(() => Service_SinglePartnerResponse)
  async service_deletePartner(
    @Arg('_id') _id: ObjectId
  ): Promise<Service_SinglePartnerResponse> {
    try {
      const partner = await PartnerModel.findByIdAndDelete(_id)

      if (!partner) throw new Error('Partner not found')

      return { partner }
    } catch (e) {
      console.error('error', e)
      return {
        errors: [{ field: 'service_deletePartner', message: 'Deletion failed' }]
      }
    }
  }

  @UseMiddleware(isServiceAuth)
  @Query(() => Service_SinglePartnerResponse)
  async service_PartnerFindById(
    @Arg('_id') _id: ObjectId
  ): Promise<Service_SinglePartnerResponse> {
    try {
      const partner = await PartnerModel.findById(_id)

      if (!partner) throw new Error('Partner not found')

      return { partner }
    } catch (e) {
      console.error('error', e)
      return {
        errors: [
          { field: 'service_PartnerFindById', message: 'Find by ID failed' }
        ]
      }
    }
  }

  @UseMiddleware(isServiceAuth)
  @Query(() => Service_MultiPartnerResponse)
  async service_PartnerGetAll(): Promise<Service_MultiPartnerResponse> {
    try {
      const partner = await PartnerModel.find({})

      return { partner }
    } catch (e) {
      console.error('error', e)
      return {
        errors: [
          {
            field: 'service_PartnerGetAll',
            message: 'Something failed getting all partner'
          }
        ]
      }
    }
  }
}
