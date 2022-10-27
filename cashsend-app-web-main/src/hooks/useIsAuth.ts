import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMeQuery } from '@generated/graphql'

export const useIsAuth = () => {
  const { data, loading } = useMeQuery()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !data?.user_me) {
      router.replace('/login?next=' + router.pathname)
    }
  }, [loading, data, router])
}
