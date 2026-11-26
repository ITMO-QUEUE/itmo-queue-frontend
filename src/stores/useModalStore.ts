import { create } from 'zustand'

export type ModalState =
	| { type: 'create-defense-session' }
	| { type: 'create-user' }
	| { type: 'edit-user'; props: { userId: string } }
	| {
			type: 'confirm-delete'
			props: { title: string; onConfirm: () => Promise< void > | void }
	  }

interface ModalStore {
	activeModal: ModalState | null
	openModal: ( modal: ModalState ) => void
	closeModal: () => void
}

export const useModalStore = create< ModalStore >( set => ( {
	activeModal: null,

	openModal: modal => set( { activeModal: modal } ),

	closeModal: () => set( { activeModal: null } )
} ) )
