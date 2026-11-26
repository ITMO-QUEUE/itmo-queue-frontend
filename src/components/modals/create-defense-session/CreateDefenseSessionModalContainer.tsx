// components/modals/containers/CreateDefenseSessionModalContainer.tsx
import { useQuery } from '@tanstack/react-query'
import {
	// createQueueSession,
	getSessionOptions
} from '../../../app/api/queues/queues.api'
import { CreateDefenseSessionModal } from '../../../features/queue-teacher/components/CreateDefenseSessionModal'

interface Props {
	onClose: () => void
}

export const CreateDefenseSessionModalContainer = ( { onClose }: Props ) => {
	const {
		isPending,
		isError,
		error,
		data: sessionOptions
	} = useQuery( {
		queryKey: [ 'session-options' ],
		queryFn: getSessionOptions
	} )

	if ( isPending ) {
		return (
			<div className='rounded-dialog bg-bg-surface p-6 font-nunito text-text-primary'>
				Загрузка данных...
			</div>
		)
	}

	if ( isError ) {
		return (
			<div className='rounded-dialog bg-bg-surface p-6 font-nunito text-text-primary'>
				<p>Не удалось загрузить данные для создания очереди.</p>
				<p className='mt-2 text-small text-text-secondary'>{ error.message }</p>
			</div>
		)
	}

	if ( ! sessionOptions ) {
		return null
	}

	return (
		<CreateDefenseSessionModal
			teachers={ sessionOptions.teachers }
			disciplines={ sessionOptions.disciplines }
			onClose={ onClose }
			onSubmit={ async payload => {
				// TODO: убедиться, что контракт с новым API соблюдён, потом можно снять коммент
				// await createQueueSession( payload )
				console.log( payload )
			} }
		/>
	)
}
