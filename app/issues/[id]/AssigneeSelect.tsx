'use client';
import { User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/app/components';

const AssigneeSelect = () => {
	const {
		data: users,
		error,
		isLoading,
	} = useQuery<User[]>({
		queryKey: ['users'],
		queryFn: async () => {
			const { data } = await axios.get('/api/users');
			return data;
		},
		staleTime: 60 * 1000, // 60s
		retry: 3,
	});
	if (error) return null;
	if (isLoading) return <Skeleton />;

	return (
		<Select.Root defaultValue="apple">
			<Select.Trigger placeholder="Assign..." />
			<Select.Content>
				<Select.Group>
					<Select.Label>Suggestions</Select.Label>
					{users?.map((users) => (
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
