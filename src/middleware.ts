// /middleware.ts

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin', // Redirect if not authenticated
  },
});

export const config = {
  matcher: ['/admin/:path*'], // Protect all admin routes
};
