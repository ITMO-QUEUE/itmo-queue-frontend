import { skipToken, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getQueueById } from '../../app/api/queues/queues.api'
import type { QueueDetail } from '../../app/api/queues/queues.api.d'
import { Page } from '../../components/common/Page.tsx'
import { QueueRows } from '../../components/common/QueueRows'
import { QueueStatus } from '../../components/common/QueueStatus'
import { UIAlert, UIAlertTone } from '../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../components/ui/UIButton.tsx'
import { QueueStatus as QueueStatusEnum } from '../../components/ui/UIQueueStatus'
import { UITab } from '../../components/ui/UITab'
import { QueueHistory } from '../../features/queue-teacher/components/QueueHistory'
import { QueueSettings } from '../../features/queue-teacher/components/QueueSettings'
import { TeacherWorkplace } from '../../features/queue-teacher/components/TeacherWorkplace'
import type {
	fullQueue,
	QueueChanges
} from '../../features/queue-teacher/types/queue'
import { useAuthStore } from '../../stores/useAuthStore'
import {
	ParticipantStatus,
	type StudentRecord
} from '../../types/StudentRecord'

type QueueTab = 'queue' | 'settings' | 'history'

const queueStatuses = {
	preliminary: QueueStatusEnum.PREREGISTRATION,
	active: QueueStatusEnum.ACTIVE,
	finished: QueueStatusEnum.COMPLETED
} satisfies Record< QueueDetail[ 'stage' ], fullQueue[ 'status' ] >

const participantStatuses = {
	waiting: ParticipantStatus.WAITING,
	called: ParticipantStatus.CALLED,
	in_defense: ParticipantStatus.IN_DEFENSE,
	completed: ParticipantStatus.COMPLETED,
	cancelled: ParticipantStatus.CANCELLED,
	removed: ParticipantStatus.REMOVED
} satisfies Record<
	QueueDetail[ 'students' ][ number ][ 'status' ],
	ParticipantStatus
>

const toPageQueue = ( detail: QueueDetail ): fullQueue => ( {
	id: detail.id,
	subject: detail.discipline_name as fullQueue[ 'subject' ],
	teachers: detail.teachers.map( teacher => teacher.name ),
	startsAt: new Date( detail.planned_start ),
	endsAt: new Date( detail.planned_end ),
	status: queueStatuses[ detail.stage ],
	isRegistrationOpen: detail.registration_open,
	studentsMax: detail.quota,
	auditorium: detail.location ?? '',
	teacher: '',
	queueNumber: detail.my_entry?.position ?? 0,
	// QueueDetail не содержит номера лабораторных и требование артефакта.
	works: [],
	requireArtifact: false,
	minutesPerStudent: detail.avg_duration_min ?? 0,
	studentRecords: detail.students
		.map(
			( student ): StudentRecord => ( {
				...student,
				status: participantStatuses[ student.status ]
			} )
		)
		.sort(
			( a, b ) =>
				Number( a.is_reserve ) - Number( b.is_reserve ) ||
				( a.position ?? Number.MAX_SAFE_INTEGER ) -
					( b.position ?? Number.MAX_SAFE_INTEGER )
		)
} )

const dateFormatter = new Intl.DateTimeFormat( 'ru-RU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
} )
const timeFormatter = new Intl.DateTimeFormat( 'ru-RU', {
	hour: '2-digit',
	minute: '2-digit'
} )

export const TeacherQueuePage = () => {
	const currentUser = useAuthStore( state => state.user )
	const [ activeTab, setActiveTab ] = useState< QueueTab >( 'queue' )
	const [ queueStates, setQueueStates ] = useState<
		Record< string, QueueChanges >
	>( {} )
	const navigate = useNavigate()
	const { queueId } = useParams< { queueId: string } >()
	const {
		data: queueDetail,
		isLoading,
		isError,
		error,
		refetch
	} = useQuery( {
		queryKey: [ 'queue', queueId ],
		queryFn: queueId ? () => getQueueById( queueId ) : skipToken
	} )
	const initialQueue = queueDetail ? toPageQueue( queueDetail ) : undefined
	const queue = initialQueue
		? { ...initialQueue, ...queueStates[ initialQueue.id ] }
		: undefined

	if ( isLoading ) {
		return (
			<Page title='Загрузка очереди'>
				<p role='status'>Загрузка данных очереди…</p>
			</Page>
		)
	}

	if (
		isError &&
		! queueDetail &&
		! ( isAxiosError( error ) && error.response?.status === 404 )
	) {
		return (
			<Page title='Не удалось загрузить очередь'>
				<p role='alert'>
					Не удалось получить данные очереди. Попробуйте ещё раз.
				</p>
				<UIButton
					label='Повторить'
					tone={ UIButtonTone.SECONDARY }
					onClick={ () => {
						void refetch()
					} }
				/>
			</Page>
		)
	}

	if ( ! queue || ! queueDetail ) {
		return (
			<Page title='Очередь не найдена'>
				<p>Очередь с указанным идентификатором отсутствует.</p>
			</Page>
		)
	}

	const isPreregistration = queue.status === QueueStatusEnum.PREREGISTRATION
	const isActive = queue.status === QueueStatusEnum.ACTIVE
	const isCompleted = queue.status === QueueStatusEnum.COMPLETED
	const activeRecords = queue.studentRecords.filter( record =>
		[
			ParticipantStatus.WAITING,
			ParticipantStatus.CALLED,
			ParticipantStatus.IN_DEFENSE
		].includes( record.status )
	)
	const deletedRecords = queue.studentRecords.filter( record =>
		[ ParticipantStatus.CANCELLED, ParticipantStatus.REMOVED ].includes(
			record.status
		)
	)
	const updateQueueState = ( changes: QueueChanges ) => {
		setQueueStates( previous => ( {
			...previous,
			[ queue.id ]: {
				...previous[ queue.id ],
				...changes
			}
		} ) )
	}

	return (
		<div className='flex min-h-full w-full flex-col gap-8 bg-bg-page p-content'>
			<div className='w-full max-w-64 rounded-control bg-bg-surface'>
				<UIButton
					label='← Мои очереди'
					tone={ UIButtonTone.GHOST }
					fullWidth
					onClick={ () => navigate( '/teacher/queues' ) }
				/>
			</div>
			<header className='flex w-full flex-col gap-6'>
				<h1 className='text-heading text-text-primary'>{ queue.subject }</h1>
				<p className='text-body text-text-secondary'>{ queueDetail.title }</p>
				{ queueDetail.description && <p>{ queueDetail.description }</p> }
				<p className='text-body text-text-secondary'>
					{ queue.works.some( work => work.type === 'lab' ) &&
						'Лабораторные работы · ' }
					{ dateFormatter.format( queue.startsAt ) }
				</p>
				<div className='flex flex-wrap gap-4'>
					<QueueStatus type={ queue.status } />
					<QueueStatus
						type={
							queue.isRegistrationOpen
								? QueueStatusEnum.REGISTRATION_OPEN
								: QueueStatusEnum.REGISTRATION_CLOSED
						}
					/>
				</div>
				<div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-body text-text-secondary'>
					<span>{ queue.teachers.join( ' · ' ) }</span>
					<span aria-hidden='true'>/</span>
					<span className='whitespace-nowrap'>
						{ timeFormatter.format( queue.startsAt ) }–
						{ timeFormatter.format( queue.endsAt ) }
					</span>
					<span aria-hidden='true'>/</span>
					{ queue.auditorium ? (
						<span>ауд. { queue.auditorium }</span>
					) : queue.onlineLink ? (
						<a
							className='text-action-primary hover:underline'
							href={ queue.onlineLink }
						>
							Онлайн
						</a>
					) : (
						<span>Место не указано</span>
					) }
				</div>
			</header>
			<div className='flex gap-2 overflow-x-auto'>
				<UITab
					label='Очередь'
					active={ activeTab === 'queue' }
					onClick={ () => setActiveTab( 'queue' ) }
					className='w-[230px] shrink-0'
				/>
				<UITab
					label='Настройки'
					active={ activeTab === 'settings' }
					onClick={ () => setActiveTab( 'settings' ) }
					className='w-[230px] shrink-0'
				/>
				<UITab
					label='История'
					active={ activeTab === 'history' }
					onClick={ () => setActiveTab( 'history' ) }
					className='w-[230px] shrink-0'
				/>
			</div>
			{ activeTab === 'queue' && ! isCompleted && (
				<div className='flex flex-col gap-6'>
					<div className='flex flex-wrap gap-4'>
						<div className='w-[240px] shrink-0'>
							<UIButton
								label='Открыть запись'
								tone={ UIButtonTone.SECONDARY }
								fullWidth
								disabled={ isCompleted || queue.isRegistrationOpen }
								onClick={ () =>
									updateQueueState( { isRegistrationOpen: true } )
								}
							/>
						</div>
						<div className='w-[240px] shrink-0'>
							<UIButton
								label='Закрыть запись'
								tone={ UIButtonTone.SECONDARY }
								fullWidth
								disabled={ isCompleted || ! queue.isRegistrationOpen }
								onClick={ () =>
									updateQueueState( { isRegistrationOpen: false } )
								}
							/>
						</div>
						{ isPreregistration && (
							<div className='w-[240px] shrink-0'>
								<UIButton
									label='Начать активную защиту'
									tone={ UIButtonTone.PRIMARY }
									fullWidth
									disabled={ isCompleted }
									onClick={ () =>
										updateQueueState( {
											status: QueueStatusEnum.ACTIVE,
											isRegistrationOpen: false
										} )
									}
								/>
							</div>
						) }
						{ isActive && (
							<div className='w-[240px] shrink-0'>
								<UIButton
									label='Завершить сеанс'
									tone={ UIButtonTone.DANGER }
									fullWidth
									disabled={ isCompleted }
									onClick={ () =>
										updateQueueState( {
											status: QueueStatusEnum.COMPLETED,
											isRegistrationOpen: false
										} )
									}
								/>
							</div>
						) }
					</div>
					{ isPreregistration && (
						<UIAlert
							tone={ UIAlertTone.INFO }
							title='Идёт предварительная запись'
							message={ `Начало активной защиты выполняется вручную. Плановое начало — ${ timeFormatter.format( queue.startsAt ) }.` }
						/>
					) }
					{ ! isPreregistration && (
						<TeacherWorkplace
							key={ `${ queue.id }:${ currentUser?.id }` }
							queue={ queueDetail }
							teacherId={ currentUser?.id }
							name={ currentUser?.name }
						/>
					) }
					<section
						className='flex min-w-0 flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'
						aria-labelledby='queue-participants-title'
					>
						<h2
							id='queue-participants-title'
							className='text-section text-text-primary'
						>
							Участники очереди
						</h2>
						<p className='text-small text-text-secondary'>
							Одна работа — одно место. Сначала приоритет 1, затем приоритет 2.
						</p>
						{ activeRecords.length === 0 ? (
							<p className='text-body text-text-secondary'>
								В очереди пока нет участников.
							</p>
						) : (
							<div className='overflow-x-auto'>
								<div className='min-w-[900px]'>
									<QueueRows
										records={ activeRecords }
										currentUser={ currentUser }
									/>
								</div>
							</div>
						) }
					</section>
					<section
						className='flex min-w-0 flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'
						aria-labelledby='queue-deleted-records-title'
					>
						<h2
							id='queue-deleted-records-title'
							className='text-section text-text-primary'
						>
							Удалённые записи
						</h2>
						{ deletedRecords.length === 0 ? (
							<p className='text-body text-text-secondary'>
								Удалённых записей нет.
							</p>
						) : (
							<div className='overflow-x-auto'>
								<div className='min-w-[900px]'>
									<QueueRows
										records={ deletedRecords }
										currentUser={ currentUser }
									/>
								</div>
							</div>
						) }
					</section>
				</div>
			) }
			{ activeTab === 'settings' && (
				<QueueSettings
					key={ queue.id }
					queue={ queue }
					onSave={ updateQueueState }
				/>
			) }
			{ ( activeTab === 'history' || isCompleted ) && (
				<div className='flex min-w-0 flex-row gap-4'>
					<section
						className='flex min-w-0 flex-1 flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'
						aria-labelledby='queue-WorkResults-title'
					>
						<h2
							id='queue-WorkResults-title'
							className='text-section text-text-primary'
						>
							Попытки и результаты
						</h2>
						<QueueHistory
							key={ queue.id }
							queueId={ queue.id }
						/>
					</section>
					<section
						className='flex min-w-0 self-start shrink-0 basis-[calc((100%_-_--spacing(4))/3)] flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'
						aria-labelledby='queue-WorkResults-history'
					>
						<h3
							id='queue-WorkResults-history'
							className='text-subheading text-text-primary'
						>
							История сеанса
						</h3>
						<div className='text-body text-text-secondary'>
							Каждая работа и попытка хранятся отдельно. Неявка относится к дате
							попытки.
						</div>
					</section>
				</div>
			) }
		</div>
	)
}
