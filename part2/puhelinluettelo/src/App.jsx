import { useState, useEffect } from 'react'
import Filter from './components/filter'
import Persons from './components/persons'
import Personform from './components/personform'
import personsService from './services/persons'
import Notification from './components/notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
    }, [])


  const handleNewNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    personsService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNotification(`Deleted  ${persons.find(p => p.id === id).name}`)
      })
  }

  const updatePerson = (id, personObject) => {
    personsService
      .update(id, personObject)
      .then(response => {
        setPersons(persons.map(person => person.id !== id ? person : response.data))
      })
      .catch(error => {
        if (error.response.status === 404) {
          setNotification(`Information of ${personObject.name} has already been removed from server`)
          setPersons(persons.filter(person => person.id !== id))
        }
        else {
          setNotification(`Error: ${JSON.stringify(error.response.data)}`)
        }

      })
  }

  const checkIfNameExists = (name) => {
    return persons.some(person => person.name === name)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (checkIfNameExists(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        updatePerson(person.id, personObject)
        setNotification(`Updated ${newName}'s number`)
      }
      setNewName('')
      setNewNumber('')
      return
    }

    personsService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNotification(`Added ${newName}`)
        setNewName('')
        setNewNumber('')
    })
    .catch(error => {
      console.log(error.response.data)
      setNotification(`Error: ${JSON.stringify(error.response.data)}`)
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <div>
        <Filter filter={filter} persons={persons} handleFilterChange={handleFilterChange} />
      </div>
      <h2>Add a new</h2>
        <Personform
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNewNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNewNumberChange} />
      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} handleDelete={handleDelete}/>
    </div>
  )

}

export default App
