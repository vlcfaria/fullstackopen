import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Numbers from './components/Numbers'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const addPerson = (event) => {
    event.preventDefault()

    let person = persons.find((person) => person.name == newName)

    if (person && window.confirm(`${newName} is already added to phonebook, replace old number?`)) {
      let newPerson = {...person, number: newNumber}
      personService.update(newPerson)
      .then(() => {
        setPersons(persons.map(val => val.id == newPerson.id ? newPerson : val))
        setSuccessMessage(`Modified ${newPerson.name} succesfully`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(err => {
        setErrorMessage(`User ${newPerson.name} already deleted on the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      return
    }

    personService.create({name: newName, number:newNumber})
    .then(response => {
      const returnedPerson = response.data
      setPersons(persons.concat(returnedPerson))
      setSuccessMessage(`Added ${returnedPerson.name} sucessfully`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }).catch(err => {
      setErrorMessage(err.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    })
  }

  const removePerson = personToDelete => {
    if(window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.remove(personToDelete)
      .then(() => {
        setPersons(persons.filter(person => person.id != personToDelete.id))
      })
      .catch(err => {
        alert("Name already deleted from server!")
      })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNewFilter(event.target.value)

  //Changing filter will also render corrected filtered, since the whole App is refreshed
  const regex = new RegExp(newFilter, 'i');
  const filtered = persons.filter((person) => person.name.match(regex))

  useEffect(() => {
    personService
    .getAll()
    .then(returnedPersons => {
      setPersons(returnedPersons)
    })
  } ,[])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification msg={successMessage} className={'success'}/>
      <Notification msg={errorMessage} className={'error'}/>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Numbers persons={filtered} removePerson={removePerson}/>
    </div>
  )
}

export default App