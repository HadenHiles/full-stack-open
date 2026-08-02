const info = (...messages) => {
	if (process.env.NODE_ENV !== 'test') {
		console.log(...messages)
	}
}

const error = (...messages) => {
	if (process.env.NODE_ENV !== 'test') {
		console.error(...messages)
	}
}

module.exports = { info, error }
