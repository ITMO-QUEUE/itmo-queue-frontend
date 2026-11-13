import { tw } from '../../libs/utils'

export interface UIQueueStatusProps {
	label: string
	status: QueueStatus
}

export enum QueueStatus {
	PREREGISTRATION = 'preregistration',
	REGISTRATION_CLOSED = 'registration-closed',
	REGISTRATION_OPEN = 'registration-open',
	ACTIVE = 'active',
	PAUSED = 'paused',
	COMPLETED = 'completed'
}

const BASE_CLASSES = tw(
	'inline-flex items-center justify-center',
	'text-label whitespace-nowrap p-2 h-36px w-60',
	'rounded-full'
)

const STATUS_CLASSES: Record<QueueStatus, string> = {
	[QueueStatus.PREREGISTRATION]: tw('text-action-primary bg-bg-selected'),
	[QueueStatus.REGISTRATION_CLOSED]: tw('text-text-secondary bg-bg-page'),
	[QueueStatus.REGISTRATION_OPEN]: tw(
		'text-status-success bg-status-success-bg'
	),
	[QueueStatus.ACTIVE]: tw('text-status-success bg-status-success-bg'),
	[QueueStatus.PAUSED]: tw('text-status-warning bg-status-warning-bg'),
	[QueueStatus.COMPLETED]: tw('text-text-secondary bg-bg-page')
}

export const UIQueueStatus = ({ label, status }: UIQueueStatusProps) => (
	<span className={tw(BASE_CLASSES, STATUS_CLASSES[status])}>{label}</span>
)
