import api from "./index"

export const invokeGraph = async (body) => {
  // body should conform to GraphInputSchema (see openapi.json)
  return await api.post("/v1/graph/invoke", body)
}
