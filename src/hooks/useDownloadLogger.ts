// hooks/useDownloadLogger.ts
import Cookies from 'js-cookie';
import { api } from '~/utils/api';
import { generateUniqueId } from '~/utils/generateUniqueId';

const useDownloadLogger = () => {
  const logDownload = api.download.logDownload.useMutation();
  const cookieId = Cookies.get("cookieId") || generateUniqueId();
  Cookies.set("cookieId", cookieId, { expires: 365 });
  const logDownloadToServer = async (file_path: string) => {
    try {
      await logDownload.mutateAsync({cookieId, file_path });
    } catch (error) {
      console.error("Failed to log download:", error);
    }
  };

  return logDownloadToServer;
};

export default useDownloadLogger;
