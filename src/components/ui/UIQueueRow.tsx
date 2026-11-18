import Lock from '@/assets/icons/Lock.svg'

import { tw } from '../../libs/utils'
import { UIButton, UIButtonTone } from './UIButton'
import {
	UIParticipantStatus,
	type UIParticipantStatusProps,
	UIParticipantStatusStatus
} from './UIParticipantStatus'

export interface UIQueueRowProps {
	position: number
	name: string
	works?: readonly string[]
	workname?: string
	link: string
	participantStatus: UIParticipantStatusProps
	isMe?: boolean
	group?: string
	linkLabel?: string
	viewerRole?: 'student' | 'teacher'
	forceDisable: boolean //для случаев, когда необходимо принудительно закрыть все доступ к кнопкам в обход обычной логике
	onAction?: () => void | Promise<void>
}

const BASE_CLASSES = tw(
	'flex min-w-0 flex-1 items-center gap-4 p-4',
	'font-nunito border border-border-subtle rounded-control'
)
const DETAILS_CLASSES = tw('flex min-w-0 basis-2/5 flex-col gap-1')
const LINK_CLASSES = tw(
	'text-caption text-action-primary w-fit rounded-control',
	'hover:text-action-hover hover:underline',
	'focus-visible:outline-2 focus-visible:outline-offset-2',
	'focus-visible:outline-border-focus'
)

const WORK_PLURALS = new Intl.PluralRules('ru')
const WORK_LABELS: Record<string, string> = {
	one: 'работа',
	few: 'работы',
	many: 'работ',
	other: 'работ'
}

export const UIQueueRow = ({
	position,
	name,
	works,
	workname,
	link,
	participantStatus,
	group = 'Основная группа',
	linkLabel = 'Открыть артефакты',
	isMe = false,
	viewerRole = 'student',
	onAction,
	forceDisable = false //например, когда сам пользователь вызван, чтобы закрыть все остальные кнопки
}: UIQueueRowProps) => {
	const isTop3 = position >= 1 && position <= 3
	const isTeacher = viewerRole === 'teacher'
	const isCalled = participantStatus.status === UIParticipantStatusStatus.CALLED
	const actionLabel =
		isTeacher ? 'Управлять'
		: isMe ? 'Моя запись'
		: isTop3 ? 'Топ 3'
		: 'Обменяться'
	const isActionDisabled =
		!(isTeacher || isMe) && (forceDisable || isCalled || isTop3)
	const participantWorks = works ?? (workname ? [workname] : [])
	const workCount = participantWorks.length
	const workLabel = WORK_LABELS[WORK_PLURALS.select(workCount)]

	return (
		<div className='flex w-full items-center'>
			<div
				className={tw(BASE_CLASSES, isMe ? 'bg-bg-selected' : 'bg-bg-surface')}
			>
				<span className='w-20 shrink-0 text-label text-text-primary'>
					<span className='sr-only'>Позиция в очереди: </span>
					{position}
				</span>
				<div className={DETAILS_CLASSES}>
					<span className='text-label text-text-primary wrap-break-word'>
						{name}
						{isMe && ' · вы'}
					</span>
					<span className='text-small text-text-secondary wrap-break-word'>
						{workCount} {workLabel}
						{workCount > 0 && ` · ${participantWorks.join(', ')}`}
					</span>
					{(isMe || isTeacher) && (
						<a
							className={LINK_CLASSES}
							href={link}
						>
							{linkLabel} <span aria-hidden='true'>→</span>
						</a>
					)}
				</div>
				<div
					className='min-w-0 flex-1'
					aria-hidden='true'
				/>
				<div className='w-44 shrink-0'>
					<UIParticipantStatus {...participantStatus} />
				</div>
				<span className='w-36 shrink-0 text-right text-small text-text-secondary wrap-break-word'>
					{isTop3 ?
						<span className='inline-flex items-center gap-1'>
							Топ-3
							{!isTeacher && (
								<img
									src={Lock}
									alt='lock'
								/>
							)}
						</span>
					:	group}
				</span>
			</div>
			<div className='ml-4 w-36 shrink-0 [&>button]:w-full text-text-primary'>
				<UIButton
					label={actionLabel}
					tone={UIButtonTone.GHOST}
					disabled={isActionDisabled}
					onClick={() => onAction?.()}
				/>
			</div>
		</div>
	)
}
