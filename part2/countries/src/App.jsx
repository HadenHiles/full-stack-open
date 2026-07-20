import { useEffect, useState } from 'react'
import axios from 'axios'
import CountryResults from './components/CountryResults'

const App = () => {
	const [countries, setCountries] = useState([])
	const [search, setSearch] = useState('')

	useEffect(() => {
		axios
			.get('https://studies.cs.helsinki.fi/restcountries/api/all')
			.then(countryResponse => setCountries(countryResponse.data))
	}, [])

	const matchingCountries = countries.filter(country =>
		country.name.common.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div>
			<div>
				find countries{' '}
				<input
					value={search}
					onChange={event => setSearch(event.target.value)}
				/>
			</div>
			<CountryResults
				search={search}
				countries={matchingCountries}
				showCountry={setSearch}
			/>
		</div>
	)
}

export default App
