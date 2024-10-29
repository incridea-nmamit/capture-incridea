// hooks/useDownloadLogger.ts
import { api } from '~/utils/api';

const useDownloadLogger = () => {
  const logDownload = api.download.logDownload.useMutation();

  const logDownloadToServer = async (file_path: string) => {
    try {
      await logDownload.mutateAsync({ file_path });
    } catch (error) {
      console.error("Failed to log download:", error);
    }
  };

  return logDownloadToServer;
};

export default useDownloadLogger;
