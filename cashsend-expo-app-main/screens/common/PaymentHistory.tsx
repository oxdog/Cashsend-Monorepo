import Display from '@assets/svg/Display.svg'
import { SimpleLayout } from '@components/SimpleLayout'
import { SimpleLoadingMessage } from '@components/SimpleLoadingMessage'
import { SupportPrompt } from '@components/SupportPrompt'
import { useGetAllOrdersQuery } from '@generated/graphql-react'
import { mongoTimestampToCalendar } from '@utils/mongoTimestampToCalendar'
import React, { useEffect, useState } from 'react'
import { Button, Colors, Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

type OrderHistoryEntry = {
  _id: string
  createdAt: string
  partner: { name: string }
  amount: number
  type: string
  transferGroup: string
}

export default function PaymentHistory() {
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [initLoading, setInitLoading] = useState<boolean>(true)
  const [ordersExist, setOrdersExist] = useState<boolean>()

  const { data, loading, fetchMore, networkStatus } = useGetAllOrdersQuery({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  })

  useEffect(() => {
    if (data) {
      setInitLoading(false)

      const { orders } = data.order_GetAllFromUser
      setOrdersExist(!!(orders && orders.length > 0))
    }
  }, [data, loading])

  const getPaymentHistoryEntry = (
    order: OrderHistoryEntry,
    lastElement: boolean
  ) => (
    <View
      style={{
        ...tailwind('w-full mx-4 py-2 px-2 flex flex-row'),
        ...(!lastElement ? tailwind('border-b-2 border-gray-200') : {})
      }}
      key={order._id}
    >
      <Display style={tailwind('w-12 h-12 self-start mt-4')} />

      <View style={tailwind('flex flex-grow flex-col pl-2')}>
        <Text thin>{mongoTimestampToCalendar(order.createdAt)}</Text>
        <Text semibold>{order.partner.name}</Text>
        <View style={tailwind('flex flex-row justify-between')}>
          <Text semibold>
            {(order.amount / 100).toString().replace('.', ',')}€
          </Text>
          <Text thin>Hilfe</Text>
        </View>
        <Text selectable thin style={tailwind('text-xs mt-2')}>
          {order.transferGroup}
        </Text>
      </View>
    </View>
  )

  const getDateRange = () => {
    const orders = data?.order_GetAllFromUser.orders

    if (!orders) return

    let from
    let to

    if (orders!.length > 0) {
      from = mongoTimestampToCalendar(orders![0].createdAt)
      to =
        orders!.length > 1
          ? mongoTimestampToCalendar(orders![orders!.length - 1].createdAt)
          : from
    }

    return (
      <View key="getDateRange" style={tailwind('mt-16')}>
        <Text thin>
          von {from} bis {to}
        </Text>
      </View>
    )
  }

  const getOrders = () => (
    <View key="getOrders">
      <View
        style={tailwind(
          'mt-4 flex flex-col w-full items-center justify-between'
        )}
      >
        {data?.order_GetAllFromUser.orders?.map((order, index) =>
          getPaymentHistoryEntry(
            order as OrderHistoryEntry,
            index + 1 === data?.order_GetAllFromUser.orders!.length
          )
        )}
      </View>
      <View style={tailwind('my-12')}>
        <View style={tailwind('border mx-16 mb-4 border-gray-200')} />
        <SupportPrompt />
      </View>
      {hasMore && (
        <Button
          label={'mehr'}
          style={tailwind('mt-4')}
          // onPress={handleCloseDialog}
          color={Colors.grey40}
          outlineColor={Colors.grey40}
          outline
          // disabled={state.loading}
        />
      )}
    </View>
  )

  const getNoOrderHint = () => (
    <View key="getNoOrderHint">
      <View
        style={tailwind(
          'mt-16 flex flex-col w-full items-center justify-between'
        )}
      >
        <Text thin style={tailwind('text-center w-full mt-2')}>
          Keine Zahlungen vorhanden
        </Text>
      </View>
      <View style={tailwind('my-12')}>
        <View style={tailwind('border mx-16 mb-4 border-gray-200')} />
        <SupportPrompt />
      </View>
    </View>
  )

  return (
    <View>
      <SimpleLayout>
        {initLoading ? (
          <View style={tailwind('mt-16')}>
            <SimpleLoadingMessage />
          </View>
        ) : (
          <>
            {ordersExist ? [getDateRange(), getOrders()] : [getNoOrderHint()]}
          </>
        )}
      </SimpleLayout>
    </View>
  )
}
