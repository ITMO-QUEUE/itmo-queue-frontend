import { tw } from '../../libs/utils'
import {
	UIParticipantStatus,
	type UIParticipantStatusProps,
	UIParticipantStatusStatus
} from './UIParticipantStatus'
import top3Image from '../../assets/icons/Lock.svg'

export interface UIQueueRowProps {
	position: number
	name: string
	workname: string
	priority: number
	link: string
	participantStatus: UIParticipantStatusProps
	linkLabel?: string
	top3ImageSrc?: string
	onMoreClick?: () => void
}

const BASE_CLASSES = tw(
	'flex flex-wrap items-center gap-4 w-full p-4',
	'font-nunito border border-border-subtle rounded-control'
)

const DETAILS_CLASSES = tw( 'flex min-w-0 flex-1 flex-col gap-1' )
const ACTIONS_CLASSES = tw(
	'flex min-w-0 flex-1 flex-wrap items-center justify-start gap-4'
)
const LINK_CLASSES = tw(
	'text-caption text-action-primary w-fit rounded-control',
	'hover:text-action-hover hover:underline',
	'focus-visible:outline-2 focus-visible:outline-offset-2',
	'focus-visible:outline-border-focus'
)
const MORE_CLASSES = tw(
	'inline-flex size-8 items-center justify-center rounded-control',
	'text-text-secondary cursor-pointer hover:bg-action-subtle-hover',
	'focus-visible:outline-2 focus-visible:outline-offset-2',
	'focus-visible:outline-border-focus'
)

export const UIQueueRow = ( {
	position,
	name,
	workname,
	priority,
	link,
	participantStatus,
	linkLabel = 'Ссылка на код',
	top3ImageSrc = top3Image,
	onMoreClick
}: UIQueueRowProps ) => {
	const isTop3 = position >= 1 && position <= 3
	const isCalled = participantStatus.status === UIParticipantStatusStatus.CALLED

	return (
		<div
			className={ tw(
				BASE_CLASSES,
				isCalled ? 'bg-bg-selected' : 'bg-bg-surface'
			) }
		>
			<span className='text-label text-text-primary shrink-0'>
				<span className='sr-only'>Позиция в очереди: </span>
				{ position }
			</span>
			<div className={ DETAILS_CLASSES }>
				<span className='text-label text-text-primary break-words'>
					{ name }
				</span>
				<span className='text-small text-text-secondary break-words'>
					{ workname } · приоритет { priority }
				</span>
				<a
					className={ LINK_CLASSES }
					href={ link }
				>
					{ linkLabel } <span aria-hidden='true'>→</span>
				</a>
			</div>
			<div className={ ACTIONS_CLASSES }>
				<UIParticipantStatus { ...participantStatus } />
				{ isTop3 ? (
					<span className='inline-flex items-center gap-1 text-small text-text-secondary'>
						Топ-3 ·
						{ top3ImageSrc ? (
							<img
								src={ top3ImageSrc }
								alt=''
								className='size-4 shrink-0 object-contain'
							/>
						) : (
							<span
								aria-hidden='true'
								className='size-4 shrink-0 rounded-sm bg-disabled-bg'
							/>
						) }
					</span>
				) : onMoreClick ? (
					<button
						type='button'
						className={ MORE_CLASSES }
						onClick={ onMoreClick }
						aria-label={ `Действия участника: ${ name }` }
					>
						<span aria-hidden='true'>···</span>
					</button>
				) : (
					<span
						aria-hidden='true'
						className='inline-flex size-8 items-center justify-center text-text-secondary'
					>
						···
					</span>
				) }
			</div>
		</div>
	)
}
