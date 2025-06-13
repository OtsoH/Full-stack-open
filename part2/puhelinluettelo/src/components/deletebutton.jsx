const DeleteButton = ({ person, handleDelete }) => {
  const handleClick = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      handleDelete(person.id)
    }
  }

  return (
    <button onClick={handleClick}>
      delete
    </button>
  )
}

export default DeleteButton