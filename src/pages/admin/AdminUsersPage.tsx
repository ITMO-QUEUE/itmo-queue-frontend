import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Page } from '../../components/common/Page'
import { UIAlert, UIAlertTone } from '../../components/ui/UIAlert'
import { UIInput } from '../../components/ui/UIInput'
import { UIUserRow, type UserItem } from '../../components/ui/UIUserRow'
import { getUsers } from '../../features/queue-admin/api/getUsersApi'

const filterUsers = ( users: UserItem[], query: string | null ): UserItem[] => {
	const normalizedQuery = query?.trim().toLowerCase()
	if ( ! normalizedQuery ) return users

	return users.filter( user => {
		const byName = user.name.toLowerCase().includes( normalizedQuery )
		const byLogin = user.login.toLowerCase().includes( normalizedQuery )
		const byIsu = user.isu
			? user.isu.toLowerCase().includes( normalizedQuery )
			: false

		return byName || byLogin || byIsu
	} )
}

export const AdminUsersPage = () => {
	const [ searchFilter, setSearchFilter ] = useState< string | null >( null )

	const {
		data: users = [],
		isError,
		isLoading
	} = useQuery( {
		queryKey: [ 'users' ],
		//TODO добавить пагинацию
		queryFn: () => getUsers( { limit: 100, offset: 0 } )
	} )

	const filteredUsers = useMemo(
		() => filterUsers( users, searchFilter ),
		[ searchFilter, users ]
	)

	const onSearchFilterChange = ( value: string ): void => {
		setSearchFilter( value.trim() === '' ? null : value )
	}

	return (
		<Page
			title='Пользователи'
			subtitle='Создание учётных записей и управление доступом'
			sidebutton='create-user'
		>
			<UIInput
				label='Поиск'
				onChange={ onSearchFilterChange }
				value={ searchFilter ?? '' }
				type='text'
				placeholder='Имя, логин или табельный номер'
			/>

			<div className='flex flex-col w-full h-auto p-6 gap-3 bg-white'>
				{ isLoading && (
					<div className='py-8 text-center text-sm text-neutral-500'>
						Загрузка списка пользователей...
					</div>
				) }

				{ isError && (
					<UIAlert
						tone={ UIAlertTone.ERROR }
						title='Ошибка загрузки'
						message='Не удалось получить список пользователей. Проверьте права доступа или попробуйте позже.'
					/>
				) }

				{ ! isLoading &&
					! isError &&
					filteredUsers.length > 0 &&
					filteredUsers.map( user => (
						<UIUserRow
							key={ user.id }
							user={ user }
						/>
					) ) }

				{ ! isLoading && ! isError && filteredUsers.length === 0 && (
					<div className='py-8 text-center text-sm text-neutral-500'>
						{ searchFilter
							? `Пользователи по запросу «${ searchFilter }» не найдены`
							: 'Список пользователей пуст' }
					</div>
				) }
			</div>
		</Page>
	)
}
