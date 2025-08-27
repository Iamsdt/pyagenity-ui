import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import ct from "@constants/"

/**
 * CommentCard component displays a comment with user details.
 */
const CommentCard = ({ email, body, name, avatar, date, likes }) => {
  const { t } = useTranslation()

  return (
    <Card className="m-5 p-5 w-[300px] min-h-[240px] flex flex-col justify-between shadow-lg rounded-xl bg-white hover:shadow-2xl transition-shadow">
      <div className="flex items-center mb-3">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full border-2 border-amber-400 mr-3 object-cover"
        />
        <div>
          <CardTitle className="text-lg text-amber-600">{name}</CardTitle>
          <p className="text-xs text-gray-400">{email}</p>
        </div>
      </div>
      <CardDescription className="text-base mb-2">
        <span className="block text-sm text-gray-500 font-semibold mb-1">
          {t(ct.translate.todo.comments)}:
        </span>
        <span className="text-gray-800">{body?.slice(0, 80)}</span>
      </CardDescription>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">
          {new Date(date).toLocaleDateString()}
        </span>
        <span className="flex items-center text-amber-500 font-semibold">
          <svg className="w-4 h-4 mr-1 fill-amber-400" viewBox="0 0 20 20">
            <path d="M3 10a7 7 0 1114 0A7 7 0 013 10zm7-5a5 5 0 100 10A5 5 0 0010 5zm0 7a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
          {likes}
        </span>
      </div>
    </Card>
  )
}

export default CommentCard

CommentCard.propTypes = {
  body: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
}
