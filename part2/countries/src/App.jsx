import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital?.[0]}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.svg} alt={`flag of ${country.name.common}`} width={150} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const matches = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const renderResult = () => {
    if (search === '') return null
    if (matches.length > 10) return <p>Too many matches, specify another filter</p>
    if (matches.length === 1) return <Country country={matches[0]} />
    return (
      <ul>
        {matches.map(c => (
          <li key={c.name.common}>
            {c.name.common}
            <button onClick={() => setSearch(c.name.common)}>show</button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <div>find countries <input value={search} onChange={e => setSearch(e.target.value)} /></div>
      {renderResult()}
    </div>
  )
}

export default App
