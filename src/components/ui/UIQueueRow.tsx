import { tw } from '../../libs/utils'
import {
	UIParticipantStatus,
	type UIParticipantStatusProps
} from './UIParticipantStatus'
import { UIButton, UIButtonTone} from './UIButtn'

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
}

const BASE_CLASSES = tw(
	'flex items-center gap-4 w-full p-4',
	'font-nunito border border-border-subtle rounded-control'
)
const DETAILS_CLASSES = tw( 'flex min-w-0 basis-2/5 flex-col gap-1' )
const LINK_CLASSES = tw(
	'text-caption text-action-primary w-fit rounded-control',
	'hover:text-action-hover hover:underline',
	'focus-visible:outline-2 focus-visible:outline-offset-2',
	'focus-visible:outline-border-focus'
)

const WORK_PLURALS = new Intl.PluralRules( 'ru' )
const WORK_LABELS: Record< string, string > = {
	one: 'работа',
	few: 'работы',
	many: 'работ',
	other: 'работ'
}

export const UIQueueRow = ( {
	position,
	name,
	works,
	workname,
	link,
	participantStatus,
	group = 'Основная группа',
	linkLabel = 'Открыть артефакты',
	isMe = false
}: UIQueueRowProps ) => {
	const isTop3 = position >= 1 && position <= 3
	const participantWorks = works ?? ( workname ? [ workname ] : [] )
	const workCount = participantWorks.length
	const workLabel = WORK_LABELS[ WORK_PLURALS.select( workCount ) ]

	return (
		<div
			className={ tw(
				BASE_CLASSES,
				isMe ? 'bg-bg-selected' : 'bg-bg-surface'
			) }
		>
			<span className='w-20 shrink-0 text-label text-text-primary'>
				<span className='sr-only'>Позиция в очереди: </span>
				{ position }
			</span>
			<div className={ DETAILS_CLASSES }>
				<span className='text-label text-text-primary break-words'>
					{ name }
					{ isMe && ' · вы' }
				</span>
				<span className='text-small text-text-secondary break-words'>
					{ workCount } { workLabel }
					{ workCount > 0 && ` · ${ participantWorks.join( ', ' ) }` }
				</span>
				{ isMe && (
					<a
						className={ LINK_CLASSES }
						href={ link }
					>
						{ linkLabel } <span aria-hidden='true'>→</span>
					</a>
				) }
			</div>
			<div
				className='min-w-0 flex-1'
				aria-hidden='true'
			/>
			<div className='w-44 shrink-0'>
				<UIParticipantStatus { ...participantStatus } />
			</div>
			<span className='w-36 shrink-0 text-right text-small text-text-secondary break-words'>
				{ isTop3 ? 'Топ-3' : group }
			</span>
		</div>
	)
}
