import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
	getAllWorks,
	updateMyEntryWorks
} from '../../../app/api/queues/queues.api'
import type {
	QueueDetail,
	WorkRead
} from '../../../app/api/queues/queues.api.d'
import { WorkFields } from './QueueEnrollment'

interface EditFormProps {
	queue: QueueDetail
	works: WorkRead[]
	onClose: () => void
}

const EditForm = ({ queue, works, onClose }: EditFormProps) => {
	const queryClient = useQueryClient()
	const [artifacts, setArtifacts] = useState<Record<string, string>>(
		() => Object.fromEntries(
			(queue.my_entry?.works ?? []).map(work => [
				work.work_id,
				work.artifact_url ?? ''
			])
		)
	)

	const saving = useMutation({
		mutationFn: () => updateMyEntryWorks(queue.id, {
			works: Object.entries(artifacts).map(([work_id, url]) => ({
				work_id,
				artifact_url: url.trim()
			}))
		}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['queue', queue.id]
			})
			onClose()
		}
	})

	const toggleWork = (id: string, checked: boolean) => {
		setArtifacts(previous => {
			const next = { ...previous }
			if (checked) next[id] = ''
			else delete next[id]
			return next
		})
	}

	return (
		<form
			className='flex flex-col gap-4'
			onSubmit={event => {
				event.preventDefault()
				if (Object.keys(artifacts).length && !saving.isPending) {
					saving.mutate()
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
					disabled={saving.isPending}
					onToggle={checked => toggleWork(work.id, checked)}
					onUrlChange={value =>
						setArtifacts(previous => ({ ...previous, [work.id]: value }))
					}
				/>
			))}
			{saving.isError && (
				<p role='alert' className='text-small text-status-danger'>
					Не удалось сохранить изменения. Возможно, вас уже
					вызвали или состав доступных работ изменился.
				</p>
			)}
			<div className='flex flex-wrap gap-3'>
				<button
					type='submit'
					disabled={saving.isPending || !Object.keys(artifacts).length}
					className='rounded-control bg-action-primary px-4 py-2 text-text-inverse disabled:opacity-50'
				>
					Сохранить изменения
				</button>
				<button
					type='button'
					disabled={saving.isPending}
					onClick={onClose}
					className='rounded-control border border-border-control px-4 py-2 disabled:opacity-50'
				>
					Отмена
				</button>
			</div>
		</form>
	)
}

export const EditQueueEntry = ({ queue }: { queue: QueueDetail }) => {
	const [editing, setEditing] = useState(false)
	const available =
		queue.my_entry?.status === 'waiting' &&
		queue.stage !== 'finished'

	const worksQuery = useQuery({
		queryKey: ['works'],
		queryFn: getAllWorks,
		enabled: editing && available
	})

	const works = (worksQuery.data ?? []).filter(work =>
		work.is_active &&
		queue.works.some(item => item.work_id === work.id)
	)

	if (!available) {
		return null
	}

	return (
		<div className='flex flex-col gap-4'>
			{!editing ? (
				<button
					type='button'
					onClick={() => setEditing(true)}
					className='self-start rounded-control border border-border-control px-4 py-2'
				>
					Изменить работы и артефакты
				</button>
			) : (
				<>
					<h3 className='text-section'>Редактирование записи</h3>
					{worksQuery.isPending && <p>Загрузка работ…</p>}
					{worksQuery.isError && (
						<button type='button' onClick={() => worksQuery.refetch()}>
							Не удалось загрузить работы. Повторить
						</button>
					)}
					{worksQuery.isSuccess && works.length > 0 && (
						<EditForm
							queue={queue}
							works={works}
							onClose={() => setEditing(false)}
						/>
					)}
					{worksQuery.isSuccess && works.length === 0 && (
						<p>Нет доступных работ для редактирования.</p>
					)}
					{!worksQuery.isSuccess && (
						<button type='button' onClick={() => setEditing(false)}>
							Закрыть
						</button>
					)}
				</>
			)}
		</div>
	)
}