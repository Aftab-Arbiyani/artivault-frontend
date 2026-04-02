import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { queryKeys } from '@/services/queryKeys';

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user(id!),
    queryFn: () => userService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
