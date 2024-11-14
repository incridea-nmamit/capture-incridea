import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import Analysis from '~/components/AnalyticsPage/Analytics'

const Analytics = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
     void router.push('/unauthorized');
    }
    if (status === 'authenticated' && session?.user?.role === 'user') {
      void router.push('/unauthorized');
    }
  }, [session, status, router]);
  
  return (
    <div>
      <Analysis/>
    </div>
  )
}

export default Analytics
