import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { mockFullQueues } from '../../features/queue-teacher/mocks/FullQueues.ts'
import { Page } from '../../components/common/Page.tsx'
import { UIButton, UIButtonTone } from '../../components/ui/UIButton.tsx'
import { QueueStatus } from '../../components/common/QueueStatus'
import { QueueStatus as QueueStatusEnum } from '../../components/ui/UIQueueStatus'
import { UITab } from '../../components/ui/UITab'
import { UIQueueRow } from '../../components/ui/UIQueueRow'
import { UIParticipantStatusStatus } from '../../components/ui/UIParticipantStatus'
import type { QueueChanges } from '../../features/queue-teacher/types/queue'
import { QueueSettings } from '../../features/queue-teacher/components/QueueSettings'
import { UIStudentWorkResult, type UIStudentWorkResultProps } from '../../components/ui/UIStudentWorkResult'

type QueueTab = 'queue' | 'settings' | 'history'

type HistoryAttempt = Omit<UIStudentWorkResultProps, 'OnClick'> & { id: string }

const testResults: HistoryAttempt[] = [
	{
		id: 'attempt-001',
		WorkName: 'ЛР № 3',
		Subject: 'Программирование',
		date: '26 октября',
		startTime: '14:00',
		endTime: '16:00',
		Session: 'защита лабораторных работ',
		Teacher: 'Павел Кузнецов',
		result: '7,5 / 10'
	},
	{
		id: 'attempt-002',
		WorkName: 'ЛР № 4',
		Subject: 'Программирование',
		date: '26 октября',
		startTime: '14:00',
		endTime: '16:00',
		Session: 'защита лабораторных работ',
		Teacher: 'Елена Иванова',
		result: 'Принято'
	},
	{
		id: 'attempt-003',
		WorkName: 'ЛР № 3',
		Subject: 'Программирование',
		date: '19 октября',
		startTime: '14:00',
		endTime: '16:00',
		Session: 'защита лабораторных работ',
		Teacher: 'Павел Кузнецов',
		result: 'Неявка'
	}
]

const participantStatusLabels: Record<UIParticipantStatusStatus, string> = {
	[UIParticipantStatusStatus.WAITING]: 'Ожидает',
	[UIParticipantStatusStatus.CALLED]: 'Вызван',
	[UIParticipantStatusStatus.DEFENDING]: 'На защите',
	[UIParticipantStatusStatus.ACCEPTED]: 'Принято',
	[UIParticipantStatusStatus.NO_SHOW]: 'Не явился'
}

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
	const [queueStates, setQueueStates] = useState<Record<string, QueueChanges>>({})
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
	const updateQueueState = (changes: QueueChanges) => {
		setQueueStates(previous => ({
			...previous,
			[queue.id]: {
				...previous[queue.id],
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
			<div className='flex gap-2 overflow-x-auto'>
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
			{activeTab === 'queue' && !isCompleted && (
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
					<section className='flex min-w-0 flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6' aria-labelledby='queue-participants-title'>
						<h2 id='queue-participants-title' className='text-section text-text-primary'>
							Участники очереди
						</h2>
						{queue.students.length === 0 ? (
							<p className='text-body text-text-secondary'>В очереди пока нет участников.</p>
						) : (
							<div className='overflow-x-auto'>
								<ul className='flex min-w-[900px] flex-col gap-4'>
									{[...queue.students].sort((a, b) => a.position - b.position).map(student => (
										<li key={student.id}>
											<UIQueueRow
												position={student.position}
												name={student.name}
												works={student.works.map(work => `ЛР № ${work.number}`)}
												link={student.works.find(work => work.link)?.link ?? null}
												participantStatus={{ status: student.status, label: participantStatusLabels[student.status] }}
												group={student.group}
												viewerRole='teacher'
												forceDisable={isCompleted}
											/>
										</li>
									))}
								</ul>
							</div>
						)}
					</section>
				</div>
			)}
			{activeTab === 'settings' && (
				<QueueSettings key={queue.id} queue={queue} onSave={updateQueueState} />
			)}
			{(activeTab === 'history' || isCompleted) && (
				<div className='flex min-w-0 flex-row gap-4'>
				<section className='flex min-w-0 flex-1 flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6' aria-labelledby='queue-WorkResults-title'>
					<h2 id='queue-WorkResults-title' className='text-section text-text-primary'>
							Попытки и результаты
					</h2>
					<ul aria-label='История попыток' className='grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-4'>
						{testResults.map(({ id, ...attempt }) => (
							<li key={id}>
								<UIStudentWorkResult
									{...attempt}
									OnClick={() => window.alert([
										`${attempt.WorkName} · ${attempt.Subject}`,
										`${attempt.date} · ${attempt.startTime}–${attempt.endTime}`,
										`Сеанс: ${attempt.Session}`,
										`Преподаватель: ${attempt.Teacher}`,
										`Результат: ${attempt.result ?? 'не указан'}`
									].join('\n'))}
								/>
							</li>
						))}
					</ul>
				</section>
				<section className='flex min-w-0 self-start shrink-0 basis-[calc((100%_-_--spacing(4))/3)] flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6' aria-labelledby='queue-WorkResults-history'>
					<h3 id='queue-WorkResults-history' className='text-subheading text-text-primary'>
							История сеанса
					</h3>
					<div className='text-body text-text-secondary'>
						Каждая работа и попытка хранятся отдельно. Неявка относится к дате попытки.
					</div>
				</section>
				</div>
			)}
		</div>
	)
}
