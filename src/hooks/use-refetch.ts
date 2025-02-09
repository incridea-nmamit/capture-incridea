import { useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook to refetch all active queries
 * @returns {Function} Function to trigger refetch of all active queries
 */
const UseRefetch = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.refetchQueries({
      type: 'active'
    });
  };
};

export default UseRefetch;
