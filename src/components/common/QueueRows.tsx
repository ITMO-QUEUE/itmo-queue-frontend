import type { CurrentUser } from '../../stores/useAuthStore'
import type { StudentRecord } from '../../types/StudentRecord'
import { UIQueueRow } from '../ui/UIQueueRow'

export type QueueRowsProps = {
	records: readonly StudentRecord[]
	currentUser: CurrentUser | null
	onManageRecord?: ( record: StudentRecord ) => void
}

export const QueueRows = ( {
	records,
	currentUser,
	onManageRecord
}: QueueRowsProps ) => (
	<ul
		className='flex flex-col gap-3'
		aria-label='Участники очереди'
	>
		{ records.map( ( record, index ) => {
			const previous = records[ index - 1 ]
			const startsNewGroup = previous
				? previous.is_reserve !== record.is_reserve
				: record.is_reserve

			return (
				<li key={ record.id }>
					{ startsNewGroup && (
						<div className='mb-3 border-t border-border-subtle pt-3 text-small text-text-secondary'>
							{ record.is_reserve ? 'Резерв' : 'Основная группа' }
						</div>
					) }

					<UIQueueRow
						record={ record }
						currentUser={ currentUser }
						onAction={
							onManageRecord && currentUser?.role === 'teacher'
								? () => onManageRecord( record )
								: undefined
						}
					/>
				</li>
			)
		} ) }
	</ul>
)
