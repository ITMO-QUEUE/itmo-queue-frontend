import { Dialog } from '@base-ui/react/dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import {
	changeStudentStatus,
	removeStudentFromQueue
} from '../../../app/api/queues/queues.api'
import CrossIcon from '../../../assets/icons/Cross.svg'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UIInput } from '../../../components/ui/UIInput'
import {
	ParticipantStatus,
	type StudentRecord
} from '../../../types/StudentRecord'
import { getQueueErrorMessage } from '../utils/queueError'

type Action = 'call' | 'move' | 'remove'

export const QueueParticipantDialog = ( {
	record,
	canCall,
	onClose
}: {
	record: StudentRecord
	canCall: boolean
	onClose: () => void
} ) => {
	const queryClient = useQueryClient()
	const [ confirmation, setConfirmation ] = useState<
		'move' | 'remove' | null
	>( null )
	const [ reason, setReason ] = useState( '' )
	const [ pending, setPending ] = useState< Action | null >( null )
	const [ error, setError ] = useState( '' )
	const lock = useRef( false )
	const callKey = useRef< string | null >( null )
	const closeRef = useRef< HTMLButtonElement >( null )
	const isWaiting = record.status === ParticipantStatus.WAITING
	const workNames = record.works.map( work => work.title ).join( ', ' )
	const isPending = pending !== null
	const run = async ( action: Action ) => {
		if ( lock.current || ( action !== 'call' && ! reason.trim() ) ) return
		if ( action === 'call' && ( ! canCall || ! isWaiting ) ) return
		if ( action === 'move' && ! isWaiting ) return
		lock.current = true
		setPending( action )
		setError( '' )
		try {
			if ( action === 'call' ) {
				callKey.current ??= crypto.randomUUID()
				await changeStudentStatus(
					record.queue_id,
					record.student_id,
					{ status: 'called', confirm_out_of_order: true },
					callKey.current
				)
			} else if ( action === 'move' ) {
				await changeStudentStatus( record.queue_id, record.student_id, {
					status: 'waiting',
					reason: reason.trim(),
					confirm_out_of_order: false
				} )
			} else {
				await removeStudentFromQueue(
					record.queue_id,
					record.student_id,
					reason.trim()
				)
			}
			await Promise.all( [
				queryClient.invalidateQueries( {
					queryKey: [ 'queue', record.queue_id ]
				} ),
				queryClient.invalidateQueries( {
					queryKey: [ 'teacher', 'my-queues' ]
				} )
			] )
			onClose()
		} catch ( cause ) {
			setError( getQueueErrorMessage( cause ) )
		} finally {
			lock.current = false
			setPending( null )
		}
	}

	return (
		<Dialog.Root
			open
			onOpenChange={ open => {
				if ( ! open && ! lock.current ) onClose()
			} }
		>
			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 z-50 bg-text-primary/30' />
				<Dialog.Viewport className='fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4'>
					<Dialog.Popup
						initialFocus={ closeRef }
						className={ `max-h-[calc(100dvh-2rem)] max-w-full overflow-y-auto rounded-dialog bg-bg-surface font-nunito text-text-primary shadow-lg ${ confirmation ? 'w-[560px] p-6' : 'w-[480px] p-8' }` }
					>
						<div className='flex items-start justify-between gap-4'>
							<Dialog.Title className='text-section'>
								{ confirmation === 'move'
									? 'Перенести участника в конец?'
									: confirmation === 'remove'
										? 'Удалить участника?'
										: 'Участник очереди' }
							</Dialog.Title>
							<Dialog.Close
								ref={ closeRef }
								disabled={ isPending }
								aria-label='Закрыть окно'
								className='flex size-8 shrink-0 items-center justify-center rounded-control cursor-pointer hover:bg-bg-selected focus-visible:outline-2 focus-visible:outline-border-focus'
							>
								<img
									src={ CrossIcon }
									alt=''
									className='size-icon'
								/>
							</Dialog.Close>
						</div>
						{ confirmation ? (
							<div className='mt-4 flex flex-col gap-4'>
								<Dialog.Description className='text-small text-text-secondary'>
									{ [ record.student_name, workNames ]
										.filter( Boolean )
										.join( ' · ' ) }
									.{ ' ' }
									{ confirmation === 'move'
										? 'Укажите причину переноса в конец очереди.'
										: 'Укажите причину удаления: она будет показана студенту.' }
								</Dialog.Description>
								<UIInput
									label='Причина'
									value={ reason }
									onChange={ value => {
										setReason( value )
										setError( '' )
									} }
									disabled={ isPending }
								/>
								{ error && (
									<UIAlert
										tone={ UIAlertTone.ERROR }
										message={ error }
									/>
								) }
								<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
									<UIButton
										label='Отмена'
										tone={ UIButtonTone.SECONDARY }
										fullWidth
										disabled={ isPending }
										onClick={ () => {
											setConfirmation( null )
											setReason( '' )
											setError( '' )
										} }
									/>
									<UIButton
										label={
											confirmation === 'move'
												? 'Перенести в конец'
												: 'Удалить участника'
										}
										tone={
											confirmation === 'move'
												? UIButtonTone.PRIMARY
												: UIButtonTone.DANGER
										}
										fullWidth
										loading={ pending === confirmation }
										disabled={ isPending || ! reason.trim() }
										onClick={ () => run( confirmation ) }
									/>
								</div>
							</div>
						) : (
							<div className='mt-6 flex flex-col gap-6'>
								<h2 className='text-heading wrap-break-word'>
									{ record.student_name }
								</h2>
								<Dialog.Description className='text-small text-text-secondary'>
									{ [
										record.position === null
											? 'Без места'
											: `Место ${ record.position }`,
										workNames,
										record.is_reserve ? 'резерв' : 'основная группа'
									]
										.filter( Boolean )
										.join( ' · ' ) }
								</Dialog.Description>
								{ record.works
									.filter( work => work.artifact_url )
									.map( work => (
										<a
											key={ work.work_id }
											href={ work.artifact_url! }
											target='_blank'
											rel='noopener noreferrer'
											className='text-body text-action-primary hover:underline wrap-break-word'
										>
											{ work.title } · открыть артефакт →
										</a>
									) ) }
								{ error && (
									<UIAlert
										tone={ UIAlertTone.ERROR }
										message={ error }
									/>
								) }
								<UIButton
									label='Вызвать вне очереди'
									tone={ UIButtonTone.PRIMARY }
									fullWidth
									loading={ pending === 'call' }
									disabled={ isPending || ! canCall || ! isWaiting }
									onClick={ () => run( 'call' ) }
								/>
								<UIButton
									label='Перенести в конец'
									tone={ UIButtonTone.SECONDARY }
									fullWidth
									loading={ pending === 'move' }
									disabled={ isPending || ! isWaiting }
									onClick={ () => {
										setConfirmation( 'move' )
										setReason( '' )
										setError( '' )
									} }
								/>
								<UIButton
									label='Удалить'
									tone={ UIButtonTone.DANGER }
									fullWidth
									disabled={ isPending }
									onClick={ () => {
										setConfirmation( 'remove' )
										setReason( '' )
										setError( '' )
									} }
								/>
							</div>
						) }
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
