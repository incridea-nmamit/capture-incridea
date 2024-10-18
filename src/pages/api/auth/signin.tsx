// /pages/auth/signin.tsx

import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={() => signIn('google')}
        className="px-4 py-2 text-white bg-blue-500 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
