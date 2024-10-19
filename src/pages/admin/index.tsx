import React from 'react'
import { useSession } from "next-auth/react";
import SignIn from './signin';
function Admin() {
    const { data: session } = useSession();
    if (!session) {
        // Handle unauthenticated state, e.g. render a SignIn component
        return <SignIn/>;
      }
  return (
    <div>
      {session.user.email}
      {session.user.role}
    </div>
  )
}

export default Admin
