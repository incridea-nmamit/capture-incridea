/**
 * SignIn Component
 * Provides a simple sign-in interface using NextAuth
 */

import React from 'react'
import { signIn } from 'next-auth/react'

/**
 * SignIn component that renders a sign-in button
 * Uses NextAuth's signIn function for authentication
 */
function SignIn() {
  return (
    <div>
      <button
        onClick={async () => await signIn()}
      >
        Sign In
      </button>
    </div>
  )
}

export default SignIn
