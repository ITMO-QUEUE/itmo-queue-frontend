import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createQueueEventSource } from '../../../app/api/system/system.api'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'auth'

const queueEvents = [
	'snapshot',
	'queue.updated',
	'participant.status_changed',
	'queue.status_changed'
]

interface ConnectionProps {
	queueId: string
	onReconnect: () => void
}

const QueueConnection = ({ queueId, onReconnect }: ConnectionProps) => {
	const queryClient = useQueryClient()
	const [status, setStatus] = useState<ConnectionStatus>('connecting')

	useEffect(() => {
		const source = createQueueEventSource(queueId)
		const refresh = () => {
			void queryClient.invalidateQueries({
				queryKey: ['queue', queueId],
				exact: true
			})
		}

		source.onopen = () => {
			setStatus('connected')
			refresh()
		}
		source.onerror = () => setStatus('disconnected')

		for (const event of queueEvents) {
			source.addEventListener(event, refresh)
		}
		source.addEventListener('auth.required', () => {
			setStatus('auth')
			source.close()
		})

		return () => source.close()
	}, [queueId, queryClient])

	if (status === 'connected') {
		return (
			<p role='status' className='text-small text-status-success'>
				Очередь обновляется в реальном времени
			</p>
		)
	}

	if (status === 'auth') {
		return (
			<p role='alert' className='text-small text-status-danger'>
				Сессия завершилась или доступ изменился.
				Обновите страницу и при необходимости войдите снова.
			</p>
		)
	}

	return (
		<div
			role='status'
			className='flex flex-col items-start gap-3 rounded-control bg-status-warning-bg p-4 text-small'
		>
			<p>
				{status === 'connecting'
					? 'Подключаем обновления очереди…'
					: 'Связь потеряна. Данные могут быть устаревшими. Пробуем восстановить соединение.'}
			</p>
			{status === 'disconnected' && (
				<button
					type='button'
					onClick={onReconnect}
					className='cursor-pointer text-action-primary underline'
				>
					Переподключиться
				</button>
			)}
		</div>
	)
}

export const QueueRealtime = ({ queueId }: { queueId: string }) => {
	const [attempt, setAttempt] = useState(0)

	return (
		<QueueConnection
			key={`${queueId}:${attempt}`}
			queueId={queueId}
			onReconnect={() => setAttempt(value => value + 1)}
		/>
	)
}