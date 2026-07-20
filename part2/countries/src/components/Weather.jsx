import { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
	const [weather, setWeather] = useState(null)
	const apiKey = import.meta.env.VITE_WEATHER_API_KEY

	useEffect(() => {
		if (!capital || !apiKey) {
			return
		}

		// Weather changes with the selected country, so fetch it separately.
		axios
			.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
			.then(weatherResponse => setWeather(weatherResponse.data))
			.catch(() => setWeather(null))
	}, [capital, apiKey])

	if (!weather) {
		return null
	}

	return (
		<div>
			<h3>Weather in {capital}</h3>
			<p>temperature {weather.main.temp} Celsius</p>
			<img
				src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
				alt={weather.weather[0].description}
			/>
			<p>wind {weather.wind.speed} m/s</p>
		</div>
	)
}

export default Weather
