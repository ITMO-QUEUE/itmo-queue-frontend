import { useEffect, useId, useRef, useState } from 'react'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'

interface CallDialogProps {
	queue: QueueDetail
	onDismiss: () => void
}

const CallDialog = ({ queue, onDismiss }: CallDialogProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const titleId = useId()
	const teacher = queue.teachers.find(
		item => item.id === queue.my_entry?.teacher_id
	)

	useEffect(() => {
		const dialog = dialogRef.current
		dialog?.showModal()
		return () => dialog?.close()
	}, [])

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={titleId}
			onCancel={event => {
				event.preventDefault()
				onDismiss()
			}}
			className='m-auto w-full max-w-lg rounded-card bg-bg-surface p-6 text-text-primary backdrop:bg-black/40'
		>
			<div className='flex flex-col gap-4'>
				<h2 id={titleId} className='text-section'>
					Вас вызывают на защиту
				</h2>
				<p>{queue.discipline_name}</p>
				{teacher && (
					<p className='text-small'>
						Принимает: {teacher.name}
					</p>
				)}
				<p className='text-small'>
					Место: {queue.location ?? 'Не указано'}
				</p>
				<p className='text-small text-text-secondary'>
					Подойдите к преподавателю. После вызова изменение
					места и отмена записи недоступны.
				</p>
				<button
					type='button'
					onClick={onDismiss}
					className='self-start rounded-control bg-action-primary px-4 py-2 text-text-inverse'
				>
					Понятно
				</button>
			</div>
		</dialog>
	)
}

export const QueueCallNotice = ({ queue }: { queue: QueueDetail }) => {
	const [dismissedCall, setDismissedCall] = useState<string | null>(null)
	const entry = queue.my_entry

	if (entry?.status !== 'called') {
		return null
	}

	const callId = `${entry.id}:${entry.attempt_id ?? 'called'}`
	const storageKey = `queue-call-dismissed:${entry.student_id}:${queue.id}`

	let savedCall: string | null = null

	try {
		savedCall = sessionStorage.getItem(storageKey)
	} catch {
		savedCall = null
	}

	if (dismissedCall === callId || savedCall === callId) {
		return null
	}

	const dismiss = () => {
		setDismissedCall(callId)

		try {
			sessionStorage.setItem(storageKey, callId)
		} catch {
			return
		}
	}

	return (
		<CallDialog
			key={callId}
			queue={queue}
			onDismiss={dismiss}
		/>
	)
}