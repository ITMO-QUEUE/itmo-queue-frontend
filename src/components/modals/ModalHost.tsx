import { useEffect } from 'react'
import { useModalStore } from '../../stores/useModalStore'
import { CreateDefenseSessionModalContainer } from './create-defense-session/CreateDefenseSessionModalContainer'

export const ModalHost = () => {
	const activeModal = useModalStore( state => state.activeModal )
	const closeModal = useModalStore( state => state.closeModal )

	useEffect( () => {
		if ( ! activeModal ) return

		const handleKeyDown = ( event: KeyboardEvent ) => {
			if ( event.key === 'Escape' ) {
				closeModal()
			}
		}

		window.addEventListener( 'keydown', handleKeyDown )
		return () => window.removeEventListener( 'keydown', handleKeyDown )
	}, [ activeModal, closeModal ] )

	if ( ! activeModal ) {
		return null
	}

	const renderModalContent = () => {
		switch ( activeModal.type ) {
			case 'create-defense-session':
				return <CreateDefenseSessionModalContainer onClose={ closeModal } />

			case 'create-user':
				// return <CreateUserModal onClose={ closeModal } />
				return null

			case 'edit-user':
				// return <EditUserModal userId={ activeModal.props.userId } onClose={ closeModal } />
				return null

			case 'confirm-delete':
				// return <ConfirmDeleteModal { ...activeModal.props } onClose={ closeModal } />
				return null

			default: {
				const _exhaustiveCheck: never = activeModal
				return _exhaustiveCheck
			}
		}
	}

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-text-primary/28 p-2'
			onMouseDown={ event => {
				if ( event.target === event.currentTarget ) {
					closeModal()
				}
			} }
		>
			{ renderModalContent() }
		</div>
	)
}
