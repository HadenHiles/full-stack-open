import Country from './Country'

const CountryResults = ({ search, countries, showCountry }) => {
	if (search === '') {
		return null
	}

	if (countries.length > 10) {
		// Rendering a giant country list is not useful while they are still typing.
		return <p>Too many matches, specify another filter</p>
	}

	if (countries.length === 1) {
		return <Country country={countries[0]} />
	}

	return (
		<ul>
			{countries.map(country => (
				<li key={country.name.common}>
					{country.name.common}
					<button onClick={() => showCountry(country.name.common)}>show</button>
				</li>
			))}
		</ul>
	)
}

export default CountryResults
