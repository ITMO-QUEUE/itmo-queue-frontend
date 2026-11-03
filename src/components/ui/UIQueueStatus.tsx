import { tw } from '../../libs/utils'

export interface UIQueueStatusProps {
    label: string
    status: UIQueueStatusStatus
}

export enum UIQueueStatusStatus {
    PREREGISTRATION = 'preregistration',
    REGISTRATION_CLOSED = 'registration-closed',
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed'
}

const BASE_CLASSES = tw(
    'inline-flex items-center justify-center',
	'text-label whitespace-nowrap px-3 py-2 h-36px w-240px',
	'rounded-full'
)

const STATUS_CLASSES: Record < UIQueueStatusStatus, string > = {
    [ UIQueueStatusStatus.PREREGISTRATION ]: tw('text-action-primary bg-bg-selected'),
    [ UIQueueStatusStatus.REGISTRATION_CLOSED ]: tw('text-text-secondary bg-bg-page'),
    [ UIQueueStatusStatus.ACTIVE ]: tw('text-status-success bg-status-success-bg'),
    [ UIQueueStatusStatus.PAUSED ]: tw('text-status-warning bg-status-warning-bg'),
    [ UIQueueStatusStatus.COMPLETED ]: tw('text-text-secondary bg-bg-page')
}

export const UIQueueStatus = ( { 
    label,
    status
}: UIQueueStatusProps) => (
    <span className={ tw(BASE_CLASSES, STATUS_CLASSES[ status ])}>
        { label }
    </span>
)
