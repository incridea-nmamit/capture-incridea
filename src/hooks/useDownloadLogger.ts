import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';

const useDownloadLogger = () => {
  const logDownload = api.download.logDownload.useMutation()
  const{data: session} = useSession();
  const session_user = session?.user.email || "";
  const logDownloadToServer = async (file_path: string) => {
    try {
      await logDownload.mutateAsync({session_user, file_path });
    } catch (error) {
      console.error("Failed to log download:", error);
    }
  };

  return logDownloadToServer;
};

export default useDownloadLogger;
