/**
 * User Role API
 * Retrieves authenticated user's role from session
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

/**
 * API handler for retrieving user role
 * @param req - HTTP request object
 * @param res - HTTP response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  // Get user session
  const session = await getSession({ req });

  if (session) {
    const userRole = session.user.role || 'guest';
    res.status(200).json({ role: userRole });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
