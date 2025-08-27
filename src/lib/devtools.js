import React from "react"

export const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-query-devtools").then((result) => ({
        default: result.ReactQueryDevtools,
      }))
    )
