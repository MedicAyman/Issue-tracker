'use client';
import { User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AssigneeSelect = () => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const { data } = await axios.get<User[]>('/api/users');
			setUsers(data);
		};

		fetchUsers();
	}, [users]);

	return (
		<Select.Root defaultValue="apple">
			<Select.Trigger placeholder="Assign..." />
			<Select.Content>
				<Select.Group>
					<Select.Label>Suggestions</Select.Label>
					{users.map((users) => (
						<Select.Item key={users.id} value={users.id}>
							{users.name}
						</Select.Item>
					))}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	);
};
export default AssigneeSelect;
