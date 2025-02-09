import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';

/**
 * Custom hook to log image downloads
 * @returns {Function} Function to log download events
 */
const useDownloadLogger = () => {
  // Initialize download logging mutation
  const logDownload = api.download.logDownload.useMutation();
  
  // Get current session
  const { data: session } = useSession();
  const session_user = session?.user.email ?? "";

  /**
   * Logs an image download to the server
   * @param image_id - ID of the downloaded image
   */
  const logDownloadToServer = async (image_id: number) => {
    try {
      await logDownload.mutateAsync({ session_user, image_id });
    } catch (error) {
      console.error("Failed to log download:", error);
    }
  };

  return logDownloadToServer;
};

export default useDownloadLogger;
