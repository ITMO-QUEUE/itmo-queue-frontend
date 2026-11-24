import { transcribeUserRole } from '../../libs/utils'
import { useAuthStore } from '../../stores/useAuthStore'
import type { components } from '../../types/schema'
import { UIButton, UIButtonTone } from './UIButton'
import {
	UIParticipantStatus,
	UIParticipantStatusStatus
} from './UIParticipantStatus'

export type UserItem = Omit<
	components[ 'schemas' ][ 'UserProfile' ],
	'can_create_queues' | 'stream_id'
>
export interface UIUserRowProps {
	user: UserItem
}

export const UIUserRow = ( { user }: UIUserRowProps ) => {
	const me = useAuthStore( store => store.user )

	return (
		<div className='flex w-full gap-4 items-center justify-between'>
			<div className='bg-bg-surface flex border border-border-subtle rounded-control items-center p-4 g-3 w-full'>
				<div className='flex flex-col w-full max-w-147.5'>
					<span className='text-label text-text-primary max-w-30 w-full'>
						{ user.name }
					</span>
					<span className='text-small text-text-secondary'>
						{ user.isu ? `${ user.login } · № ${ user.isu }` : user.login }
					</span>
				</div>
				<div className='flex w-full justify-end items-center'>
					<span className='text-small text-text-secondary w-30 text-start'>
						{ transcribeUserRole( user.role ) }
					</span>
					{ user.is_active ? (
						<UIParticipantStatus
							label='Активный'
							status={ UIParticipantStatusStatus.ACCEPTED }
						/>
					) : (
						<UIParticipantStatus
							label='Приостановлен'
							status={ UIParticipantStatusStatus.NO_SHOW }
						/>
					) }
				</div>
			</div>
			<UIButton
				label='Изменить'
				onClick={ () => {} }
				tone={ UIButtonTone.GHOST }
				disabled={ user.login === me?.login }
			/>
		</div>
	)
}
