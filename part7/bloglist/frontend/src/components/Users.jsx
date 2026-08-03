import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import userService from '../services/users'

const Users = () => {
	const [users, setUsers] = useState([])

	useEffect(() => {
		userService.getAll().then(data => setUsers(data))
	}, [])

	return (
		<div>
			<Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Users</Typography>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell><strong>name</strong></TableCell>
						<TableCell><strong>blogs created</strong></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{users.map(user => (
						<TableRow key={user.id}>
							<TableCell>
								<Link to={`/users/${user.id}`}>{user.name}</Link>
							</TableCell>
							<TableCell>{user.blogs.length}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default Users
