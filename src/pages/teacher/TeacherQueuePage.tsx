import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { mockFullQueues } from '../../features/queue-teacher/mocks/FullQueues.ts'
import { Page } from '../../components/common/Page.tsx'
import { UIButton, UIButtonTone } from '../../components/ui/UIButton.tsx'
import { QueueStatus } from '../../components/common/QueueStatus'
import { QueueStatus as QueueStatusEnum } from '../../components/ui/UIQueueStatus'
import { UITab } from '../../components/ui/UITab'
import type { fullQueue } from '../../features/queue-teacher/types/queue'

type QueueTab = 'queue' | 'settings' | 'history'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
})
const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
	hour: '2-digit',
	minute: '2-digit'
})

export const TeacherQueuePage = () => {
	const [activeTab, setActiveTab] = useState<QueueTab>('queue')
	const [queueStates, setQueueStates] = useState<Record<string, Pick<fullQueue, 'status' | 'isRegistrationOpen'>>>({})
	const navigate = useNavigate()
	const { queueId } = useParams<{ queueId: string }>()
	const initialQueue = mockFullQueues.find(queue => queue.id === queueId)
	const queue = initialQueue ? { ...initialQueue, ...queueStates[initialQueue.id] } : undefined

	if (!queue) {
		return (
			<Page title='Очередь не найдена'>
				<p>Очередь с указанным идентификатором отсутствует.</p>
			</Page>
		)
	}

	const isCompleted = queue.status === QueueStatusEnum.COMPLETED
	const updateQueueState = (changes: Partial<Pick<fullQueue, 'status' | 'isRegistrationOpen'>>) => {
		setQueueStates(previous => ({
			...previous,
			[queue.id]: {
				status: queue.status,
				isRegistrationOpen: queue.isRegistrationOpen,
				...changes
			}
		}))
	}

	return (
		<div className='flex min-h-full w-full flex-col gap-8 bg-bg-page p-content'>
			<div className='w-full max-w-64 rounded-control bg-bg-surface'>
			<UIButton
				label='← Мои очереди'
				tone={UIButtonTone.GHOST}
				fullWidth
				onClick={() => navigate('/teacher/queues')}
			/>
			</div>
			<header className='flex w-full flex-col gap-6'>
				<h1 className='text-heading text-text-primary'>{queue.subject}</h1>
			<p className='text-body text-text-secondary'>
				{queue.works.some(work => work.type === 'lab') && 'Лабораторные работы · '}
				{dateFormatter.format(queue.startsAt)}
			</p>
				<div className='flex flex-wrap gap-4'>
					<QueueStatus type={queue.status} />
					<QueueStatus
						type={queue.isRegistrationOpen
							? QueueStatusEnum.REGISTRATION_OPEN
							: QueueStatusEnum.REGISTRATION_CLOSED}
					/>
				</div>
					<div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-body text-text-secondary'>
						<span>{queue.teachers.join(' · ')}</span>
						<span aria-hidden='true'>/</span>	
						<span className='whitespace-nowrap'>
							{timeFormatter.format(queue.startsAt)}–{timeFormatter.format(queue.endsAt)}
						</span>
						<span aria-hidden='true'>/</span>
						{queue.auditorium ? (
						<span>ауд. {queue.auditorium}</span>
						) : (
						<a className='text-action-primary hover:underline' href={queue.onlineLink}>
							Онлайн
						</a>
					)}
				</div>
			</header>
			<div className='flex gap-2'>
				<UITab
					label='Очередь'
					active={activeTab === 'queue'}
					onClick={() => setActiveTab('queue')}
					className='w-[230px] shrink-0'
				/>
				<UITab
					label='Настройки'
					active={activeTab === 'settings'}
					onClick={() => setActiveTab('settings')}
					className='w-[230px] shrink-0'
				/>
				<UITab
					label='История'
					active={activeTab === 'history'}
					onClick={() => setActiveTab('history')}
					className='w-[230px] shrink-0'
				/>
			</div>
			{activeTab === 'queue' && (
				<div className='flex flex-col gap-6'>
					<div className='flex flex-wrap gap-4'>
						<div className='w-[240px] shrink-0'>
							<UIButton
								label='Открыть запись'
								tone={UIButtonTone.SECONDARY}
								fullWidth
								disabled={isCompleted || queue.isRegistrationOpen}
								onClick={() => updateQueueState({ isRegistrationOpen: true })}
							/>
						</div>
						<div className='w-[240px] shrink-0'>
							<UIButton
								label='Закрыть запись'
								tone={UIButtonTone.SECONDARY}
								fullWidth
								disabled={isCompleted || !queue.isRegistrationOpen}
								onClick={() => updateQueueState({ isRegistrationOpen: false })}
							/>
						</div>
						<div className='w-[240px] shrink-0'>
							<UIButton
								label='Завершить сеанс'
								tone={UIButtonTone.DANGER}
								fullWidth
								disabled={isCompleted}
								onClick={() => updateQueueState({ status: QueueStatusEnum.COMPLETED, isRegistrationOpen: false })}
							/>
						</div>
					</div>
				</div>
			)}
			{activeTab === 'settings' && (
				<div>Текущий UITab: {activeTab}</div>
			)}
			{activeTab === 'history' && (
				<div>Текущий UITab: {activeTab}</div>
			)}
		</div>
	)
}
