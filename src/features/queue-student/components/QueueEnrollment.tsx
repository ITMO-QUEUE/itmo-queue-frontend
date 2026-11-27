import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import {enrollInQueue,getAllWorks} from '../../../app/api/queues/queues.api'
import type {QueueDetail,WorkRead} from '../../../app/api/queues/queues.api.d'
import { StudentEntryCard } from './StudentEntryCard'

interface EnrollmentProps {
	queue: QueueDetail
}

interface EnrollmentFormProps extends EnrollmentProps {
	works: WorkRead[]
}

interface WorkFieldsProps {
	work: WorkRead
	priority: number
	selected: boolean
	url: string
	disabled: boolean
	onToggle: (checked: boolean) => void
	onUrlChange: (value: string) => void
}

export const WorkFields = ({
	work,
	priority,
	selected,
	url,
	disabled,
	onToggle,
	onUrlChange
}: WorkFieldsProps) => {
	const urlId = useId()

	return (
		<div className='grid gap-3 rounded-control border border-border-subtle p-4 md:grid-cols-2'>
			<label className='flex items-start gap-2 text-small'>
				<input
					type='checkbox'
					checked={selected}
					disabled={disabled}
					onChange={event => onToggle(event.target.checked)}
				/>
				{work.title} · приоритет {priority}
			</label>
			{selected && (
				<div className='flex flex-col gap-2'>
					<label htmlFor={urlId} className='text-label'>
						Ссылка на код / артефакт
					</label>
					<input
						id={urlId}
						type='url'
						value={url}
						required
						disabled={disabled}
						onChange={event => onUrlChange(event.target.value)}
						placeholder='https://github.com/...'
						className='h-11 w-full rounded-control border border-border-control px-3'
					/>
				</div>
			)}
		</div>
	)
}

const EnrollmentForm = ({ queue, works }: EnrollmentFormProps) => {
	const [artifacts, setArtifacts] = useState<Record<string, string>>({})
	const queryClient = useQueryClient()

	const enrollment = useMutation({
		mutationFn: () =>
			enrollInQueue(queue.id, {
				works: Object.entries(artifacts).map(([work_id, url]) => ({
					work_id,
					artifact_url: url.trim()
				}))
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['queue', queue.id]
			})
		}
	})

	const toggleWork = (id: string, checked: boolean) => {
		setArtifacts(previous => {
			const next = { ...previous }
			if (checked) {
				next[id] = ''
			} else {
				delete next[id]
			}
			return next
		})
	}

	return (
		<form
			className='flex flex-col gap-4'
			onSubmit={event => {
				event.preventDefault()
				if (Object.keys(artifacts).length > 0 && !enrollment.isPending) {
					enrollment.mutate()
				}
			}}
		>
			{works.map(work => (
				<WorkFields
					key={work.id}
					work={work}
					priority={queue.works.find(item => item.work_id === work.id)?.priority ?? 0}
					selected={Object.hasOwn(artifacts, work.id)}
					url={artifacts[work.id] ?? ''}
					disabled={enrollment.isPending}
					onToggle={checked => toggleWork(work.id, checked)}
					onUrlChange={value =>
						setArtifacts(previous => ({ ...previous, [work.id]: value }))
					}
				/>
			))}
			{enrollment.isError && (
				<p role='alert' className='text-small text-status-danger'>
					Не удалось записаться. Возможно, запись уже закрыта
					или вы уже записаны. Обновите страницу и повторите попытку.
				</p>
			)}
			<button
				type='submit'
				disabled={enrollment.isPending || Object.keys(artifacts).length === 0}
				className='self-start rounded-control bg-action-primary px-4 py-2 text-text-inverse disabled:opacity-50'
			>
				{enrollment.isPending ? <span>Отправляем…</span> : 'Записаться на защиту'}
			</button>
		</form>
	)
}

export const QueueEnrollment = ({ queue }: EnrollmentProps) => {
	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ['works'],
		queryFn: getAllWorks,
		enabled: !queue.my_entry && queue.registration_open && queue.stage !== 'finished'
	})

	if (queue.my_entry) {
	return <StudentEntryCard queue={queue} />
}

	if (!queue.registration_open || queue.stage === 'finished') {
		return <p className='text-small'>Запись на эту очередь закрыта.</p>
	}

	const works = (data ?? [])
		.filter(work =>
			work.is_active && queue.works.some(item => item.work_id === work.id)
		)
		.sort((first, second) => {
			const priority = (id: string) =>
				queue.works.find(item => item.work_id === id)?.priority ?? 0
			return priority(first.id) - priority(second.id)
		})

	return (
		<section className='flex flex-col gap-4 rounded-card bg-bg-surface p-6'>
			<h2 className='text-section'>Запись на защиту</h2>
			<p className='text-small text-text-secondary'>
				Выберите работы и добавьте ссылку на артефакт для каждой.
			</p>
			{isPending && <p>Загрузка работ…</p>}
			{isError && (
				<button type='button' onClick={() => refetch()}>
					Не удалось загрузить работы. Повторить
				</button>
			)}
			{data && works.length === 0 && <p>Нет доступных работ.</p>}
			{data && works.length > 0 && (
				<EnrollmentForm key={queue.id} queue={queue} works={works} />
			)}
		</section>
	)
}