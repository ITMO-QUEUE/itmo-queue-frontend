import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getQueueBans,
	liftStudentBan
} from '../../../app/api/queues/queues.api'
import type { BanRead } from '../../../app/api/queues/queues.api.d'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { getQueueErrorMessage } from '../utils/queueError'

export const QueueBans = ( { queueId }: { queueId: string } ) => {
	const queryClient = useQueryClient()
	const queryKey = [ 'queue', queueId, 'bans' ]
	const {
		data: bans,
		isPending,
		isError,
		isFetching,
		error,
		refetch
	} = useQuery( {
		queryKey,
		queryFn: () => getQueueBans( queueId )
	} )
	const liftBan = useMutation( {
		mutationFn: ( studentId: string ) => liftStudentBan( queueId, studentId ),
		onSuccess: async ( _, studentId ) => {
			await queryClient.cancelQueries( { queryKey, exact: true } )
			queryClient.setQueryData< BanRead[] >( queryKey, previous =>
				previous?.filter( ban => ban.student_id !== studentId )
			)
			await queryClient.invalidateQueries( { queryKey: [ 'queue', queueId ] } )
		}
	} )

	return (
		<div className='flex min-w-0 flex-col gap-4'>
			{ isPending && (
				<p
					role='status'
					className='text-small text-text-secondary'
				>
					Загрузка удалённых записей…
				</p>
			) }
			{ isError && (
				<>
					<UIAlert
						tone={ UIAlertTone.ERROR }
						message={ getQueueErrorMessage(
							error,
							'Не удалось загрузить удалённые записи.'
						) }
					/>
					<UIButton
						label='Повторить'
						tone={ UIButtonTone.SECONDARY }
						loading={ isFetching }
						onClick={ async () => {
							await refetch()
						} }
					/>
				</>
			) }
			{ ! isPending && ! isError && bans?.length === 0 && (
				<p className='text-body text-text-secondary'>Удалённых записей нет.</p>
			) }
			{ !! bans?.length && (
				<ul
					className='flex flex-col gap-3'
					aria-label='Участники с запретом повторной записи'
				>
					{ bans.map( ban => (
						<li
							key={ ban.student_id }
							className='flex flex-wrap items-center gap-4'
						>
							<div className='flex w-80 max-w-full flex-col gap-1 rounded-control border border-border-subtle bg-bg-surface p-4'>
								<p className='text-label text-text-primary wrap-break-word'>
									{ ban.student_name }
								</p>
								<p className='text-small text-text-secondary'>
									Повторная запись запрещена
								</p>
							</div>
							<div className='w-48 max-w-full'>
								<UIButton
									label='Снять запрет'
									tone={ UIButtonTone.SECONDARY }
									fullWidth
									disabled={ liftBan.isPending }
									loading={
										liftBan.isPending && liftBan.variables === ban.student_id
									}
									onClick={ () => {
										if ( ! liftBan.isPending ) liftBan.mutate( ban.student_id )
									} }
								/>
							</div>
						</li>
					) ) }
				</ul>
			) }
			{ liftBan.isError && (
				<UIAlert
					tone={ UIAlertTone.ERROR }
					message={ getQueueErrorMessage(
						liftBan.error,
						'Не удалось снять запрет.'
					) }
				/>
			) }
			{ liftBan.isSuccess && (
				<UIAlert
					tone={ UIAlertTone.SUCCESS }
					message='Запрет снят. Студент может повторно записаться в очередь.'
				/>
			) }
		</div>
	)
}
