import { Dialog } from '@base-ui/react/dialog'
import { useState } from 'react'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UIInput } from '../../../components/ui/UIInput'

export const FinishQueueDialog = ( {
	hasParticipants,
	pending,
	error,
	onCancel,
	onFinish
}: {
	hasParticipants: boolean
	pending: boolean
	error?: string
	onCancel: () => void
	onFinish: ( reason?: string ) => void
} ) => {
	const [ reason, setReason ] = useState( '' )
	return (
		<Dialog.Root
			open
			onOpenChange={ open => {
				if ( ! open && ! pending ) onCancel()
			} }
		>
			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 z-50 bg-text-primary/30' />
				<Dialog.Viewport className='fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4'>
					<Dialog.Popup className='flex w-[560px] max-w-full flex-col gap-4 rounded-dialog border border-border-subtle bg-bg-surface p-6 font-nunito text-text-primary'>
						<Dialog.Title className='text-section'>
							Завершить сеанс?
						</Dialog.Title>
						<Dialog.Description className='text-body text-text-secondary'>
							{ hasParticipants
								? 'Оставшиеся записи будут отменены. Укажите причину — она будет показана студентам.'
								: 'Все вызовы и защиты завершены, ожидающих участников нет. Сеанс станет доступен только для просмотра, результаты сохранятся.' }
						</Dialog.Description>
						{ hasParticipants && (
							<UIInput
								label='Причина завершения'
								value={ reason }
								onChange={ setReason }
								disabled={ pending }
							/>
						) }
						{ error && (
							<UIAlert
								tone={ UIAlertTone.ERROR }
								message={ error }
							/>
						) }
						<div className='grid w-full max-w-[464px] grid-cols-1 gap-3 sm:grid-cols-2'>
							<UIButton
								label='Завершить сеанс'
								tone={ UIButtonTone.DANGER }
								fullWidth
								loading={ pending }
								disabled={ pending || ( hasParticipants && ! reason.trim() ) }
								onClick={ () => {
									if ( ! pending && ( ! hasParticipants || reason.trim() ) )
										onFinish( hasParticipants ? reason.trim() : undefined )
								} }
							/>
							<UIButton
								label='Отмена'
								tone={ UIButtonTone.SECONDARY }
								fullWidth
								disabled={ pending }
								onClick={ onCancel }
							/>
						</div>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
