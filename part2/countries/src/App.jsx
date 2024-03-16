import { useState, useEffect} from 'react'
import SearchBar from './components/SearchBar'
import Results from './components/Results'
import axios from 'axios'

const App = () => {
  const [filter, setFilter] = useState('')
  const [selCountries, setSelCountries] = useState([])
  const [countries, setCountries] = useState([])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    if(filter) {
      const regex = new RegExp(filter, 'i')
      setSelCountries(countries.filter(country => country.name.common.match(regex)))
    }
  }

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(res => {
      setCountries(res.data)
    })
  }, [])

  return (
    <div>
      <SearchBar filter={filter} onChange={handleFilterChange} />
      <Results data={selCountries} setSelCountries={setSelCountries}/>
    </div>
  )
}

export default App