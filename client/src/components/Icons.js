import React from 'react'
import { FaTimes, FaPen, FaPlus } from 'react-icons/fa'

const setupIcon = Tag => props => (
  <Tag style={{ verticalAlign: 'text-bottom' }} {...props} />
)

export default {
  close: setupIcon(FaTimes),
  edit: setupIcon(FaPen),
  plus: setupIcon(FaPlus),
}
