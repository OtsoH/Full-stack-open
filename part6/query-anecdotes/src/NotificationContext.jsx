import { createContext, useReducer, useContext, useRef } from 'react'
import PropTypes from 'prop-types'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')
  const timeoutRef = useRef(null)

  const setNotification = (message, timeInSeconds = 5) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current)
  }

  dispatch({ type: 'SET_NOTIFICATION', payload: message })

  timeoutRef.current = setTimeout(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
    timeoutRef.current = null
  }, timeInSeconds * 1000)
}

  const clearNotification = () => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }
  dispatch({ type: 'CLEAR_NOTIFICATION' })
}

  return (
    <NotificationContext.Provider value={{
      notification,
      setNotification,
      clearNotification
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired
  }

export default NotificationContext