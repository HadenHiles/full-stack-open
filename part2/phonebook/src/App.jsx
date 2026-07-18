import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => setNotification(null), 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (newName.trim() === '') return

    const existing = persons.find(p => p.name === newName)
    if (existing) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) return
      personService
        .update(existing.id, { ...existing, number: newNumber })
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existing.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${returnedPerson.name}`)
        })
        .catch(() => {
          showNotification(`Information of ${existing.name} has already been removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== existing.id))
        })
      return
    }

    personService
      .create({ name: newName, number: newNumber })
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${returnedPerson.name}`)
      })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return
    personService
      .remove(person.id)
      .then(() => setPersons(persons.filter(p => p.id !== person.id)))
  }

  const personsToShow = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter value={filter} onChange={e => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={e => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
