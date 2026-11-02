import { tw } from '../../libs/utils'

export interface UIParticipantStatusProps {
	label: string
	status: UIParticipantStatusStatus
}

export enum UIParticipantStatusStatus {
	WAITING = 'waiting',
	CALLED = 'called',
	DEFENDING = 'defending',
	ACCEPTED = 'accepted',
	NO_SHOW = 'no-show'
}

const BASE_CLASSES = tw(
	'inline-flex items-center justify-center',
	'text-label whitespace-nowrap px-3 py-2 h-10 w-44',
	'rounded-full'
)

const STATUS_CLASSES: Record< UIParticipantStatusStatus, string > = {
	[ UIParticipantStatusStatus.WAITING ]: tw( 'text-text-secondary bg-bg-page' ),
	[ UIParticipantStatusStatus.CALLED ]: tw(
		'text-status-warning bg-status-warning-bg'
	),
	[ UIParticipantStatusStatus.DEFENDING ]: tw(
		'text-action-primary bg-bg-selected'
	),
	[ UIParticipantStatusStatus.ACCEPTED ]: tw(
		'text-status-success bg-status-success-bg'
	),
	[ UIParticipantStatusStatus.NO_SHOW ]: tw(
		'text-status-danger bg-status-danger-bg'
	)
}

export const UIParticipantStatus = ( {
	label,
	status
}: UIParticipantStatusProps ) => (
	<span className={ tw( BASE_CLASSES, STATUS_CLASSES[ status ] ) }>
		{ label }
	</span>
)
