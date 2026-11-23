import { LockKeyhole } from 'lucide-react'
import { tw } from '../../libs/utils'
import { useAuthStore } from '../../stores/useAuthStore'
import { ParticipantStatus, type StudentRecord } from '../../types/StudentRecord'
import { UIButton, UIButtonTone } from './UIButton'
import { UIParticipantStatus } from './UIParticipantStatus'

const STATUS_LABELS: Record<ParticipantStatus, string> = {
	[ParticipantStatus.WAITING]: 'Ожидает',
	[ParticipantStatus.CALLED]: 'Вызван',
	[ParticipantStatus.IN_DEFENSE]: 'На защите',
	[ParticipantStatus.COMPLETED]: 'Завершено',
	[ParticipantStatus.CANCELLED]: 'Отменено',
	[ParticipantStatus.REMOVED]: 'Удалён из очереди'
}

const LINK_CLASSES = tw(
	'text-caption text-action-primary w-fit rounded-control',
	'hover:text-action-hover hover:underline',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'
)

const WORK_PLURALS = new Intl.PluralRules('ru')
const WORK_LABELS: Record<string, string> = {
	one: 'работа', few: 'работы', many: 'работ', other: 'работ'
}

export const UIQueueRow = ({ record }: { record: StudentRecord }) => {
	const user = useAuthStore(state => state.user)
	const isTeacher = user?.type === 'teacher'
	const isMe = user?.type === 'student' && user.id === record.student_id
	const { works, is_top3, is_reserve, status } = record
	const workCount = works.length || (record.work_id ? 1 : 0)
	const workTitles = works.map(work => work.title).join(', ')
	const linkedWorks = works.filter(work => work.artifact_url)
	const actionLabel = isTeacher ? 'Управлять' : isMe ? 'Моя запись' : is_top3 ? 'Топ 3' : 'Обменяться'

	return (
		<div className='flex w-full items-center'>
			<div className={tw(
				'flex min-w-0 flex-1 items-center gap-4 p-4 font-nunito border border-border-subtle rounded-control',
				isMe ? 'bg-bg-selected' : 'bg-bg-surface'
			)}>
				<span className='w-20 shrink-0 text-label text-text-primary'>
					<span className='sr-only'>Позиция в очереди: </span>
					{record.position ?? ''}
				</span>
				<div className='flex min-w-0 basis-2/5 flex-col gap-1'>
					<span className='text-label text-text-primary break-words'>
						{record.student_name}{isMe && ' · вы'}
					</span>
					<span className='text-small text-text-secondary break-words'>
						{workCount} {WORK_LABELS[WORK_PLURALS.select(workCount)]}
						{workTitles && ` · ${workTitles}`}
					</span>
					{(isMe || isTeacher) && linkedWorks.map(work => (
						<a key={work.work_id} className={LINK_CLASSES} href={work.artifact_url ?? undefined}>
							Открыть артефакты · {work.title} <span aria-hidden='true'>→</span>
						</a>
					))}
					{(isMe || isTeacher) && !linkedWorks.length && record.artifact_url && (
						<a className={LINK_CLASSES} href={record.artifact_url}>
							Открыть артефакты <span aria-hidden='true'>→</span>
						</a>
					)}
				</div>
				<div className='min-w-0 flex-1' aria-hidden='true' />
				<UIParticipantStatus status={status} label={STATUS_LABELS[status]} />
				<span className='w-36 shrink-0 text-right text-small text-text-secondary break-words'>
					{is_top3 ? (
						<span className='inline-flex items-center gap-1'>
							Топ-3
							{!isTeacher && <LockKeyhole className='size-3' aria-hidden='true' />}
						</span>
					) : is_reserve ? 'Резерв' : 'Основная группа'}
				</span>
			</div>
			<div className='ml-4 w-36 shrink-0 text-text-primary'>
				{/* StudentRecord не содержит onAction и forceDisable. До подключения действий очереди кнопка недоступна. */}
				<UIButton label={actionLabel} tone={UIButtonTone.GHOST} fullWidth onClick={() => {}} />
			</div>
		</div>
	)
}
