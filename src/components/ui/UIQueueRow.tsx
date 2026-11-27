import Lock from '@/assets/icons/Lock.svg'
import { tw } from '../../libs/utils'
import { type CurrentUser, useAuthStore } from '../../stores/useAuthStore'
import {
	ParticipantStatus,
	type StudentRecord
} from '../../types/StudentRecord'
import { UIButton, UIButtonTone } from './UIButton'

import {
	UIParticipantStatus,
	type UIParticipantStatusProps
} from './UIParticipantStatus'

type RecordRowProps = {
	record: StudentRecord
	currentUser?: CurrentUser | null
	onAction?: () => void | Promise< void >
}

type ArtifactLink = { id: string; href: string; label: string }

type RowDetails = {
	position: number | null
	name: string
	works?: readonly string[]
	workname?: string
	link?: string | null
	linkLabel?: string
	participantStatus: UIParticipantStatusProps
	isMe?: boolean
	group?: string
	viewerRole?: CurrentUser[ 'role' ]
	forceDisable?: boolean
	onAction?: () => void | Promise< void >
}

export type UIQueueRowProps = RecordRowProps | RowDetails

const STATUS_LABELS: Record< ParticipantStatus, string > = {
	[ ParticipantStatus.WAITING ]: 'Ожидает',
	[ ParticipantStatus.CALLED ]: 'Вызван',
	[ ParticipantStatus.IN_DEFENSE ]: 'На защите',
	[ ParticipantStatus.COMPLETED ]: 'Завершено',
	[ ParticipantStatus.CANCELLED ]: 'Отменено',
	[ ParticipantStatus.REMOVED ]: 'Удалён из очереди'
}

const LINK_CLASSES = tw(
	'text-caption text-action-primary w-fit rounded-control',
	'hover:text-action-hover hover:underline',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'
)

const WORK_PLURALS = new Intl.PluralRules( 'ru' )
const WORK_LABELS: Record< string, string > = {
	one: 'работа',
	few: 'работы',
	many: 'работ',
	other: 'работ'
}

function RowContent( {
	position,
	name,
	works,
	workname,
	link,
	linkLabel = 'Открыть артефакты',
	group = 'Основная группа',
	participantStatus,
	isMe = false,
	viewerRole,
	forceDisable,
	onAction,
	isTop3 = position !== null && position >= 1 && position <= 3,
	artifactLinks = [],
	workCount
}: RowDetails & {
	isTop3?: boolean
	artifactLinks?: ArtifactLink[]
	workCount?: number
} ) {
	const titles = works ?? ( workname ? [ workname ] : [] )
	const count = workCount ?? titles.length
	const links =
		! artifactLinks.length && link
			? [ { id: link, href: link, label: linkLabel } ]
			: artifactLinks
	const isTeacher = viewerRole === 'teacher'
	const actionLabel = isTeacher
		? 'Управлять'
		: isMe
			? 'Моя запись'
			: isTop3
				? 'Топ 3'
				: 'Обменяться'
	const disabled =
		! onAction ||
		( ! isTeacher &&
			! isMe &&
			( forceDisable ||
				isTop3 ||
				participantStatus.status === ParticipantStatus.CALLED ) )

	return (
		<div className='flex w-full items-center'>
			<div
				className={ tw(
					'flex min-w-0 flex-1 items-center gap-4 p-4 font-nunito border border-border-subtle rounded-control',
					isMe ? 'bg-bg-selected' : 'bg-bg-surface'
				) }
			>
				<span
					className={ tw(
						'shrink-0 text-label text-text-primary',
						isTeacher ? 'w-5' : 'w-20'
					) }
				>
					<span className='sr-only'>Позиция в очереди: </span>
					{ position }
				</span>
				<div className='flex min-w-0 basis-2/5 flex-col gap-1'>
					<span className='text-label text-text-primary wrap-break-word'>
						{ name }
						{ isMe && ' · вы' }
					</span>
					<span className='text-small text-text-secondary wrap-break-word'>
						{ isTeacher && titles.length > 0
							? titles.join( ', ' )
							: `${ count } ${ WORK_LABELS[ WORK_PLURALS.select( count ) ] }${ titles.length ? ` · ${ titles.join( ', ' ) }` : '' }` }
					</span>
					{ ( isMe || isTeacher ) &&
						links.map( artifact => (
							<a
								key={ artifact.id }
								className={ LINK_CLASSES }
								href={ artifact.href }
							>
								{ artifact.label } <span aria-hidden='true'>→</span>
							</a>
						) ) }
				</div>
				<div
					className='min-w-0 flex-1'
					aria-hidden='true'
				/>
				{ ! isTeacher && <UIParticipantStatus { ...participantStatus } /> }
				<span
					className={ tw(
						'shrink-0 text-small text-text-secondary wrap-break-word',
						isTeacher ? 'w-32 text-left' : 'w-36 text-right'
					) }
				>
					{ isTop3 ? (
						<span className='inline-flex items-center gap-1'>
							Топ-3
							{ ! isTeacher && (
								<img
									src={ Lock }
									className='size-3'
									alt=''
								/>
							) }
						</span>
					) : (
						group
					) }
				</span>
				{ isTeacher && <UIParticipantStatus { ...participantStatus } /> }
			</div>
			<div className='ml-4 w-36 shrink-0 text-text-primary'>
				<UIButton
					label={ actionLabel }
					tone={ UIButtonTone.GHOST }
					fullWidth
					disabled={ disabled }
					onClick={ () => onAction?.() }
				/>
			</div>
		</div>
	)
}

function RecordRow( { record, currentUser, onAction }: RecordRowProps ) {
	const CurrentUser = useAuthStore( state =>
		currentUser === undefined ? state.user : currentUser
	)
	const links = record.works.flatMap( work =>
		work.artifact_url
			? [
					{
						id: work.work_id,
						href: work.artifact_url,
						label: `Открыть артефакты · ${ work.title }`
					}
				]
			: []
	)

	return (
		<RowContent
			onAction={ onAction }
			position={ record.position }
			name={ record.student_name }
			works={ record.works.map( work =>
				CurrentUser?.role === 'teacher'
					? `${ work.title } · приоритет ${ work.priority }`
					: work.title
			) }
			workCount={ record.works.length || ( record.work_id ? 1 : 0 ) }
			artifactLinks={ links }
			link={ record.artifact_url }
			participantStatus={ {
				status: record.status,
				label: STATUS_LABELS[ record.status ]
			} }
			isTop3={ record.is_top3 }
			group={ record.is_reserve ? 'Резерв' : 'Основная группа' }
			viewerRole={ CurrentUser?.role }
			isMe={
				CurrentUser?.role === 'student' && CurrentUser.id === record.student_id
			}
		/>
	)
}

export const UIQueueRow = ( props: UIQueueRowProps ) =>
	'record' in props ? <RecordRow { ...props } /> : <RowContent { ...props } />
