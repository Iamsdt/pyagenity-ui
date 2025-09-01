import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { listThreads, getThread, deleteThread } from "../api/thread.api"

const config = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  refetchOnWindowFocus: false,
}

export const useFetchThreads = (parameters) => {
  return useQuery({
    queryKey: ["THREADS", parameters],
    queryFn: () => listThreads(parameters),
    enabled: !!parameters,
    retry: false,
    keepPreviousData: true,
    ...config,
  })
}

export const useFetchThreadById = (id) => {
  return useQuery({
    queryKey: ["THREADS_BY_ID", id],
    queryFn: () => getThread(id),
    enabled: !!id,
    ...config,
  })
}

export const useDeleteThread = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["DELETE_THREADS"],
    mutationFn: (id) => deleteThread(id),
    onSettled: () => {
      queryClient.invalidateQueries(["THREADS"])
      queryClient.invalidateQueries(["THREADS_BY_ID"])
    },
  })
}

export default {
  useFetchThreads,
  useFetchThreadById,
  useDeleteThread,
}
