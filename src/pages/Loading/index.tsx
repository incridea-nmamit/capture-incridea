// pages/loading.tsx

import CameraLoading from '~/components/LoadingAnimation/CameraLoading';

export default function LoadingPage() {
  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <CameraLoading />
    </div>
  );
}
