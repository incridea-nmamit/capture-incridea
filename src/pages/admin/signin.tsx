import React from 'react'
import { signIn } from 'next-auth/react'
function SignIn() {
  return (
    <div>
      <button
    onClick={async()=> await signIn()}
      >Sign In</button>
    </div>
  )
}

export default SignIn
