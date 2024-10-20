// pages/api/getUserRole.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react'; // Import the getSession function from NextAuth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getSession({ req }); // Get the session for the current request

    if (session) {
      // Assume the session contains a user object with a role property
      const userRole = session.user.role || 'guest'; // Default to 'guest' if no role found
      res.status(200).json({ role: userRole });
    } else {
      res.status(401).json({ error: 'Unauthorized' }); // No session found
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
