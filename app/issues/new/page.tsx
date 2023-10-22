'use client';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Button, Callout, Text, TextField } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssuesSchema } from '@/app/validationSchemas';
import { z } from 'zod';

type IssueForm = z.infer<typeof createIssuesSchema>;
const NewIssuePage = () => {
	const [error, setError] = useState('');
	const router = useRouter();
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IssueForm>({
		resolver: zodResolver(createIssuesSchema),
	});
	const onSubmit = async (data: IssueForm) => {
		try {
			await axios.post('/api/issues', data);
			router.push('/issues');
		} catch (error) {
			setError('Unexpected error occured. Please try again');
		}
	};
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
				{errors.title && (
					<Text color="red" as="p">
						{errors.title.message}
					</Text>
				)}
				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<SimpleMDE placeholder="Description" {...field} />
					)}
				/>
				{errors.description && (
					<Text color="red" as="p">
						{errors.description.message}
					</Text>
				)}
				<Button>Submit New Issue</Button>
			</form>
		</div>
	);
};
export default NewIssuePage;
