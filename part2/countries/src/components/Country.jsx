import Weather from './Weather'

const Country = ({ country }) => {
	return (
		<div>
			<h2>{country.name.common}</h2>
			<p>capital {country.capital?.[0]}</p>
			<p>area {country.area}</p>
			<h3>languages</h3>
			<ul>
				{Object.values(country.languages || {}).map(language => (
					<li key={language}>{language}</li>
				))}
			</ul>
			<img
				src={country.flags.svg}
				alt={`flag of ${country.name.common}`}
				width={150}
			/>
			<Weather capital={country.capital?.[0]} />
		</div>
	)
}

export default Country
