/* eslint-disable react/jsx-handler-names */
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const CommentsUI = ({
  isLoading,
  isError,
  displayComments,
  currentPage,
  onPreviousPage,
  onNextPage,
  canGoNext,
}) => {
  return (
    <div>
      <div className="flex flex-col items-center py-8">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-amber-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M12 12v.01M12 16h.01M8 12h.01M16 12h.01M12 8h.01"
            />
          </svg>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Community Comments
          </h1>
        </div>
        <span className="mt-2 text-base text-gray-500">
          See what others are saying and join the conversation!
        </span>
        <div className="w-24 h-1 mt-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400" />
      </div>
      <Separator />

      {isLoading && <div className="text-center">Loading...</div>}

      {isError && <div>Something went wrong</div>}

      {!isLoading && !isError && (
        <>
          <div className="flex flex-wrap justify-center">{displayComments}</div>
          <div className="flex justify-center space-x-4 mt-5">
            <Button
              className="m-5"
              onClick={onPreviousPage}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <Button className="m-5" onClick={onNextPage} disabled={!canGoNext}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

CommentsUI.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  displayComments: PropTypes.node,
  currentPage: PropTypes.number.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  canGoNext: PropTypes.bool.isRequired,
}

CommentsUI.defaultProps = {
  displayComments: null,
}

export default CommentsUI
