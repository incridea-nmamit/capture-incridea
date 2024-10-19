// src/types/next-auth.d.ts

import NextAuth from 'next-auth';
import { DefaultSession } from 'next-auth';

// Extend the default session to include role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Assuming the ID is a string; adjust if it's different
      role?: string; // Make role optional
    } & DefaultSession['user']; // Preserve other default user properties
  }
}

// Extend the adapter user type to include role
declare module 'next-auth/adapters' {
  interface AdapterUser {
    role?: string; // Optionally make it optional if it can be absent
  }
}
