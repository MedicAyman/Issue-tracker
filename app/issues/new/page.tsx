'use client';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Button, Callout, TextField } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';

interface newIssueInterface {
	title: string;
	description: string;
}

const NewIssuePage = () => {
	const [error, setError] = useState('');
	const router = useRouter();
	const onSubmit = async (data: newIssueInterface) => {
		try {
			await axios.post('/api/issues', data);
			router.push('/issues');
		} catch (error) {
			setError('Unexpected error occured. Please try again');
		}
	};
	const { register, control, handleSubmit } = useForm<newIssueInterface>();
	return (
		<div className="max-w-xl space-y-3">
			{error && (
				<Callout.Root color="red" className="mb-5">
					<Callout.Text>{error}</Callout.Text>
				</Callout.Root>
			)}
			<form onSubmit={handleSubmit((data) => onSubmit(data))}>
				<TextField.Root>
					<TextField.Input placeholder="Title" {...register('title')} />
				</TextField.Root>
				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<SimpleMDE placeholder="Description" {...field} />
					)}
				/>
				<Button>Submit New Issue</Button>
			</form>
		</div>
	);
};
export default NewIssuePage;
