import { useQuery } from "@tanstack/react-query"

import { getComments } from "@api/comments.api"

export const useFetchComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const response = await getComments()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
