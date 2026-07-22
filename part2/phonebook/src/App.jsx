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
		personService
			.getAll()
			.then(peopleFromServer => setPersons(peopleFromServer))
	}, [])

	const showNotification = (message, type = 'success') => {
		setNotification(message)
		setNotificationType(type)

		// One timer is plenty here. The next message will replace this one anyway.
		setTimeout(() => setNotification(null), 5000)
	}

	const addPerson = (event) => {
		event.preventDefault()
		if (newName.trim() === '') {
			return
		}

		const existingPerson = persons.find(person => person.name === newName)

		if (existingPerson) {
			// Updating in place feels better than making them delete and re-add it.
			const shouldReplaceNumber = window.confirm(
				`${newName} is already added to phonebook, replace the old number with a new one?`
			)

			if (!shouldReplaceNumber) {
				return
			}

			personService
				.update(existingPerson.id, { ...existingPerson, number: newNumber })
				.then(savedPerson => {
					setPersons(
						persons.map(person =>
							person.id === existingPerson.id ? savedPerson : person
						)
					)
					setNewName('')
					setNewNumber('')
					showNotification(`Updated ${savedPerson.name}`)
				})
				.catch(error => {
					if (error.response?.status === 404) {
						// Keep the local list honest if somebody already removed it elsewhere.
						showNotification(
							`Information of ${existingPerson.name} has already been removed from server`,
							'error'
						)
						setPersons(
							persons.filter(person => person.id !== existingPerson.id)
						)
						return
					}

					showNotification(
						error.response?.data?.error || 'Could not update person',
						'error'
					)
				})

			return
		}

		personService
			.create({ name: newName, number: newNumber })
			.then(savedPerson => {
				setPersons(persons.concat(savedPerson))
				setNewName('')
				setNewNumber('')
				showNotification(`Added ${savedPerson.name}`)
			})
			.catch(error => {
				showNotification(
					error.response?.data?.error || 'Could not add person',
					'error'
				)
			})
	}

	const deletePerson = (person) => {
		if (!window.confirm(`Delete ${person.name}?`)) {
			return
		}

		personService
			.remove(person.id)
			.then(() => {
				setPersons(
					persons.filter(savedPerson => savedPerson.id !== person.id)
				)
			})
	}

	const personsToShow = filter
		? persons.filter(person =>
				person.name.toLowerCase().includes(filter.toLowerCase())
			)
		: persons

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={notification} type={notificationType} />
			<Filter
				value={filter}
				onChange={event => setFilter(event.target.value)}
			/>
			<h3>Add a new</h3>
			<PersonForm
				onSubmit={addPerson}
				newName={newName}
				onNameChange={event => setNewName(event.target.value)}
				newNumber={newNumber}
				onNumberChange={event => setNewNumber(event.target.value)}
			/>
			<h2>Numbers</h2>
			<Persons persons={personsToShow} onDelete={deletePerson} />
		</div>
	)
}

export default App
