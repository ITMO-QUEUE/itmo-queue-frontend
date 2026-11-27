import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import {
	UIQueueCard,
	type UIQueueCardProps
} from '../../../components/ui/UIQueueCard'

export const StudentQueue = ( props: UIQueueCardProps ) => {
	const isButtonDisabled =
		props.isMoveUsed ||
		( props.studentQueue.queueNumber >= 1 &&
			props.studentQueue.queueNumber <= 3 )
	const handleCancelQueue = () => {
		// TODO: логика отмены записи
		return
	}

	return (
		<div className='flex flex-col gap-3 w-full h-auto'>
			<UIQueueCard { ...props } />
			<div className='flex justify-end items-center w-full'>
				<UIButton
					label='Отменить запись'
					onClick={ handleCancelQueue }
					tone={ UIButtonTone.GHOST }
					disabled={ isButtonDisabled }
				/>
			</div>
		</div>
	)
}
