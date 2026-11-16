import {
	QueueStatus as QueueStatusEnum,
	UIQueueStatus
} from '../ui/UIQueueStatus'

export interface QueueStatusProps {
	type: QueueStatusEnum
}

export const QueueStatus = ({ type }: QueueStatusProps) => {
	switch (type) {
		case QueueStatusEnum.ACTIVE: {
			return (
				<UIQueueStatus
					label='Активная защита'
					status={QueueStatusEnum.ACTIVE}
				/>
			)
		}
		case QueueStatusEnum.COMPLETED: {
			return (
				<UIQueueStatus
					label='Защита завершена'
					status={QueueStatusEnum.COMPLETED}
				/>
			)
		}
		case QueueStatusEnum.PAUSED: {
			return (
				<UIQueueStatus
					label='Пауза · резерв'
					status={QueueStatusEnum.PAUSED}
				/>
			)
		}
		case QueueStatusEnum.PREREGISTRATION: {
			return (
				<UIQueueStatus
					label='Предварительная запись'
					status={QueueStatusEnum.PREREGISTRATION}
				/>
			)
		}
		case QueueStatusEnum.REGISTRATION_CLOSED: {
			return (
				<UIQueueStatus
					label='Запись закрыта'
					status={QueueStatusEnum.REGISTRATION_CLOSED}
				/>
			)
		}
		case QueueStatusEnum.REGISTRATION_OPEN: {
			return (
				<UIQueueStatus
					label='Запись открыта'
					status={QueueStatusEnum.REGISTRATION_OPEN}
				/>
			)
		}
	}
}
