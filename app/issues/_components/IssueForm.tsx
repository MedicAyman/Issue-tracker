'use client';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { issueSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue } from '@prisma/client';
import { Button, Callout, TextField } from '@radix-ui/themes';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
	ssr: false,
});

interface Props {
	issue?: Issue;
}

type IssueFormData = z.infer<typeof issueSchema>;
const IssueForm = ({ issue }: Props) => {
	const [error, setError] = useState('');
	const router = useRouter();
	const [isSubmitting, setSubmitting] = useState(false);
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IssueFormData>({
		resolver: zodResolver(issueSchema),
	});
	const onSubmit = async (data: IssueFormData) => {
		try {
			setSubmitting(true);
			if (issue) await axios.patch('/api/issues/' + issue.id, data);
			else await axios.post('/api/issues', data);

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
					<TextField.Input
						defaultValue={issue?.title}
						placeholder="Title"
						{...register('title')}
					/>
				</TextField.Root>
				<ErrorMessage>{errors.title?.message}</ErrorMessage>
				<Controller
					name="description"
					control={control}
					defaultValue={issue?.description}
					render={({ field }) => (
						<SimpleMDE placeholder="Description" {...field} ref={null} />
					)}
				/>
				<ErrorMessage>{errors.description?.message}</ErrorMessage>
				<Button disabled={isSubmitting}>
					{issue ? 'Update Issue' : 'Submit New Issue '}{' '}
					<Spinner show={isSubmitting} />
				</Button>
			</form>
		</div>
	);
};
export default IssueForm;
