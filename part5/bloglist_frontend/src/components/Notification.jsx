import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message.toLowerCase().includes('error') ||
        message.toLowerCase().includes('wrong') ||
        message.toLowerCase().includes('fail')) {
    return (
      <div className="error">
        {message}
      </div>)}
  else {
    return (
      <div className="success">
        {message}
      </div>)}
}

Notification.propTypes = {
  message: PropTypes.string
}

export default Notification