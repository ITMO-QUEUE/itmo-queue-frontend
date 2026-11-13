import { QueueStatus } from '../../../components/common/QueueStatus'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import {
	UIQueueCard,
	type UIQueueCardProps
} from '../../../components/ui/UIQueueCard'
import { QueueStatus as QueueStatusEnum } from '../../../components/ui/UIQueueStatus'

export const StudentQueue = (props: UIQueueCardProps) => {
	const { isRegistrationOpen, status } = props.studentQueue
	const isButtonDisabled =
		props.isMoveUsed ||
		(props.studentQueue.queueNumber >= 1 && props.studentQueue.queueNumber <= 3)

	const handleCancelQueue = () => {
		// TODO: логика отмены записи
		return
	}

	return (
		<div className='flex flex-col gap-3 w-full h-auto'>
			<UIQueueCard {...props} />
			<div className='flex justify-between items-center w-full'>
				<div className='flex justify-start w-auto gap-2'>
					<QueueStatus type={status} />
					<QueueStatus
						type={
							isRegistrationOpen ?
								QueueStatusEnum.REGISTRATION_OPEN
							:	QueueStatusEnum.REGISTRATION_CLOSED
						}
					/>
				</div>
				<UIButton
					label='Отменить запись'
					onClick={handleCancelQueue}
					tone={UIButtonTone.GHOST}
					disabled={isButtonDisabled}
				/>
			</div>
		</div>
	)
}
