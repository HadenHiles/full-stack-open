import { Component } from 'react'

// Class component required: React only supports error boundaries via class lifecycle methods.
class ErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false, errorMessage: '' }
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, errorMessage: error.message }
	}

	componentDidCatch(error, info) {
		console.error('ErrorBoundary caught a rendering error:', error, info)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div>
					<h2>Something went wrong.</h2>
					<p>{this.state.errorMessage}</p>
				</div>
			)
		}
		return this.props.children
	}
}

export default ErrorBoundary
