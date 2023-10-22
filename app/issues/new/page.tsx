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
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof createIssuesSchema>;
const NewIssuePage = () => {
	const [error, setError] = useState('');
	const router = useRouter();
	const [isSubmitting, setSubmitting] = useState(false);
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
			setSubmitting(true);
			await axios.post('/api/issues', data);
			router.push('/issues');
		} catch (error) {
			setSubmitting(false);
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
			<form
				onSubmit={handleSubmit((data) => onSubmit(data))}
				className="space-y-3"
			>
				<TextField.Root>
					<TextField.Input placeholder="Title" {...register('title')} />
				</TextField.Root>
				<ErrorMessage>{errors.title?.message}</ErrorMessage>
				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<SimpleMDE placeholder="Description" {...field} />
					)}
				/>
				<ErrorMessage>{errors.description?.message}</ErrorMessage>
				<Button disabled={isSubmitting}>
					Submit New Issue <Spinner show={isSubmitting} />
				</Button>
			</form>
		</div>
	);
};
export default NewIssuePage;
