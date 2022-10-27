import DataLoader from 'dataloader'
import { User } from '../../model/User'

// [1,42,3,53] get this
// [{id: 1, username: 'Bob'}, {id: 42, username: 'Bob'}, {...}] return sth like this

export const createUserLoader = () =>
  new DataLoader<string, User>(async (userIds) => {
    // const users = await UserModel.findByIds(userIds as string[])
    const users = [] as any[]

    const userIdToUser: Record<string, User> = {}
    users.forEach((u) => {
      userIdToUser[u.id] = u
    })

    //The mapping is done because the order of the array matters
    return userIds.map((userId) => userIdToUser[userId])
  })
