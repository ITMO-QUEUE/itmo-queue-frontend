import { Dialog } from '@base-ui/react/dialog'
import { useRef } from 'react'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'

export type DialogAbsentProps = {
	name: string
	works: readonly string[]
	MarkAbsent: () => void | Promise< void >
	cancel: () => void
	isPending?: boolean
	message?: string
}

export const DialogAbsent = ( {
	name,
	works,
	MarkAbsent,
	cancel,
	isPending = false,
	message
}: DialogAbsentProps ) => {
	const cancelRef = useRef< HTMLButtonElement >( null )

	return (
		<Dialog.Root
			open
			onOpenChange={ open => {
				if ( ! open && ! isPending ) cancel()
			} }
		>
			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 z-50 bg-text-primary/30' />
				<Dialog.Viewport className='fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4'>
					<Dialog.Popup
						className='max-h-[calc(100dvh-2rem)] w-[560px] max-w-full overflow-y-auto rounded-dialog bg-bg-surface p-6 font-nunito text-text-primary shadow-lg'
						initialFocus={ cancelRef }
					>
						<Dialog.Title className='text-section'>
							Отметить неявку?
						</Dialog.Title>
						<Dialog.Description className='mt-4 text-body text-text-secondary'>
							<span className='block break-words'>
								{ [ name, ...works ].join( ' · ' ) }
							</span>
							<span className='block'>
								Неявка сохранится в истории этой попытки. Запись переместится в
								конец ожидающих с приоритетом 1. Принимающий освободится.
							</span>
						</Dialog.Description>
						{ message && (
							<div className='mt-4'>
								<UIAlert
									tone={ UIAlertTone.ERROR }
									message={ message }
								/>
							</div>
						) }
						<div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
							<UIButton
								label='Отметить неявку'
								tone={ UIButtonTone.DANGER }
								fullWidth
								onClick={ MarkAbsent }
								loading={ isPending }
							/>
							<Dialog.Close
								ref={ cancelRef }
								disabled={ isPending }
								className='inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-control border border-border-control bg-bg-selected px-3 py-2 text-label text-text-primary hover:bg-action-subtle-hover active:bg-action-subtle-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'
							>
								Отмена
							</Dialog.Close>
						</div>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
