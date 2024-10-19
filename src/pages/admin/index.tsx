<<<<<<< HEAD
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
=======
import { useSession } from "next-auth/react";
const User=useSession().data;
>>>>>>> 101934fc2a12c49bac41b82ef4460542007b2eb2
