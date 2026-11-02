import { tw } from '../../libs/utils'
import { UIButton, UIButtonTone } from './UIButton'

type QueueCardLocation =
	| {
			place: string
			onlineLink?: never
	  }
	| {
			place?: never
			onlineLink: string
	  }

type UIQueueCardBaseProps = {
	isNearest?: boolean
	isMoveUsed?: boolean

	subject: string
	name: string

	queueNumber: number
	totalQueueNumber?: number

	dateStart: Date
	dateEnd: Date

	onOpenQueue: () => void
	onMoveToEnd: () => void
}

export type UIQueueCardProps = UIQueueCardBaseProps & QueueCardLocation

export type UIQueueCardScenarioProps = Omit<
	UIQueueCardBaseProps,
	'onOpenQueue' | 'onMoveToEnd'
> &
	QueueCardLocation

const formatDateTime = (dateStart: Date, dateEnd: Date) => {
	const now = new Date()

	const isToday =
		dateStart.getDate() === now.getDate() &&
		dateStart.getMonth() === now.getMonth() &&
		dateStart.getFullYear() === now.getFullYear()

	const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long'
	})

	const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
		hour: '2-digit',
		minute: '2-digit'
	})

	const dateLabel = isToday ? 'Сегодня' : dateFormatter.format(dateStart)

	const startTime = timeFormatter.format(dateStart)
	const endTime = timeFormatter.format(dateEnd)

	return `${dateLabel}, ${startTime}–${endTime}`
}

export const UIQueueCard = ({
	isNearest = false,
	isMoveUsed = false,
	subject,
	name,
	queueNumber,
	dateStart,
	dateEnd,
	onlineLink,
	place,
	totalQueueNumber,
	onOpenQueue,
	onMoveToEnd
}: UIQueueCardProps) => {
	const dateTime = formatDateTime(dateStart, dateEnd)
	const isTop3 = queueNumber >= 1 && queueNumber <= 3
	const isMoveDisabled = isTop3 || isMoveUsed
	const isDark = isNearest
	const description =
		isTop3 ? 'Вы в топ-3: отмена, перенос и обмен местами недоступны.'
		: isMoveUsed ? 'Перенос уже использован. Повторное действие недоступно.'
		: 'Перенос в конец доступен один раз.'
	const cardClassName = tw(
		'flex flex-col gap-4',
		'rounded-card p-6',
		'border-l-4',
		'font-nunito',
		isDark ?
			'border-action-primary bg-action-primary text-text-inverse'
		:	'border-action-primary bg-bg-surface text-text-primary'
	)

	return (
		<div className={cardClassName}>
			<div className='text-label font-bold'>
				{isNearest ? 'Ближайшая защита' : 'Следующая защита'}
			</div>

			<h3 className='text-subheading font-bold'>
				{subject} · {name}
			</h3>

			<div className='text-body'>
				Ваше место: {queueNumber}
				{totalQueueNumber !== null &&
					totalQueueNumber !== undefined &&
					` из ${totalQueueNumber}`}
			</div>

			<div className='text-small'>
				{dateTime} ·{' '}
				{onlineLink ?
					<a
						href={onlineLink}
						target='_blank'
						rel='noopener noreferrer'
						aria-label='Ссылка на онлайн-защиту'
					>
						Контур Толк
					</a>
				: place ?
					`аудитория ${place}`
				:	'Место проведения не указано'}
			</div>

			<div className='flex flex-wrap gap-2'>
				<UIButton
					tone={UIButtonTone.SECONDARY}
					label='Открыть очередь'
					onClick={onOpenQueue}
				/>
				<UIButton
					tone={UIButtonTone.SECONDARY}
					label='В конец очереди'
					onClick={onMoveToEnd}
					disabled={isMoveDisabled}
				/>
			</div>

			<p className='text-caption'>{description}</p>
		</div>
	)
}
