import DeleteButton from "./deletebutton"

const Persons = ({ filter, persons, handleDelete }) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.name}>{person.name} {person.number}
        <DeleteButton person={person} handleDelete={handleDelete} /></li>
      ))}
    </ul>
  )
}

export default Persons