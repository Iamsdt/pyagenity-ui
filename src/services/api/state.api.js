import api from "./index"

export const fetchStateSchema = async () => {
  return await api.get("/v1/graph/stateSchema")
}

export const fetchState = async (thread_id) => {
  return await api.get(`/v1/threads/${thread_id}/state`)
}
