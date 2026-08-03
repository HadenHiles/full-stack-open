import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { List, ListItem, Typography } from '@mui/material'
import userService from '../services/users'

const UserView = () => {
	const { id } = useParams()
	const [users, setUsers] = useState([])

	useEffect(() => {
		userService.getAll().then(data => setUsers(data))
	}, [])

	const selectedUser = users.find(u => u.id === id)

	if (!selectedUser) return null

	return (
		<div>
			<Typography variant="h5" sx={{ mt: 2, mb: 1 }}>{selectedUser.name}</Typography>
			<Typography variant="h6">added blogs</Typography>
			<List dense>
				{selectedUser.blogs.map(blog => (
					<ListItem key={blog.id}>{blog.title}</ListItem>
				))}
			</List>
		</div>
	)
}

export default UserView
