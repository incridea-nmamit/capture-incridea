import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { api } from '~/utils/api';
const router = useRouter();
const { data: cardState } = api.capturecard.getCardStateByName.useQuery(
  { cardName: "Your Snaps" }
);
useEffect(() => {
  if (cardState === "inactive") {
    router.push("/captures"); // Redirect to /capture if inactive
  }
}, [cardState, router]);
const Cultural = () => {
  return (
    <div>
      
    </div>
  )
}

export default Cultural
