import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Page } from '../../components/common/Page'
import { UIAlert, UIAlertTone } from '../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../components/ui/UIButton'
import { UIInput } from '../../components/ui/UIInput'
import { UISelect, type UISelectOption } from '../../components/ui/UISelect'
import { createUser } from '../../features/queue-admin/api/registerUserApi'
import type { UserRole } from '../../stores/useAuthStore'

interface CreateUserValues {
	name: string
	isu: string
	login: string
	password: string
	role: UserRole
}

type CreateUserErrors = Partial< Record< keyof CreateUserValues, string > >

const INITIAL_VALUES: CreateUserValues = {
	name: '',
	isu: '',
	login: '',
	password: '',
	role: 'student'
}

const ROLE_OPTIONS: UISelectOption[] = [
	{ value: 'student', label: 'Студент' },
	{ value: 'teacher', label: 'Преподаватель' },
	{ value: 'admin', label: 'Администратор' }
]

const validate = ( values: CreateUserValues ): CreateUserErrors => {
	const errors: CreateUserErrors = {}

	if ( ! values.name.trim() ) {
		errors.name = 'Введите имя'
	}

	const trimmedIsu = values.isu.trim()
	if ( ! trimmedIsu ) {
		errors.isu = 'Введите табельный номер'
	} else if ( ! /^[0-9]{6}$/.test( trimmedIsu ) ) {
		errors.isu = 'Табельный номер должен состоять из 6 цифр'
	}

	const trimmedLogin = values.login.trim()
	if ( ! trimmedLogin ) {
		errors.login = 'Введите логин'
	} else if ( trimmedLogin.length < 3 ) {
		errors.login = 'Минимум 3 символа'
	}

	if ( ! values.password ) {
		errors.password = 'Введите пароль'
	} else if ( values.password.length < 8 ) {
		errors.password = 'Минимум 8 символов'
	}

	if ( ! values.role ) {
		errors.role = 'Выберите роль'
	}

	return errors
}

export const AdminCreateUserPage = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [ values, setValues ] = useState< CreateUserValues >( INITIAL_VALUES )
	const [ errors, setErrors ] = useState< CreateUserErrors >( {} )
	const [ submitError, setSubmitError ] = useState< string | null >( null )

	const { mutate, isPending } = useMutation( {
		mutationFn: createUser,
		onSuccess: () => {
			queryClient.invalidateQueries( { queryKey: [ 'users' ] } )
			navigate( '/admin' )
		},
		onError: error => {
			if ( isAxiosError( error ) && error.response?.status === 409 ) {
				setSubmitError(
					'Пользователь с таким логином или табельным номером уже существует.'
				)
				return
			}
			if ( isAxiosError( error ) && error.response?.status === 422 ) {
				setSubmitError( 'Проверьте корректность заполненных полей.' )
				return
			}
			setSubmitError( 'Не удалось создать аккаунт. Попробуйте позже.' )
		}
	} )

	const handleChange =
		< K extends keyof CreateUserValues >( field: K ) =>
		( value: CreateUserValues[ K ] ) => {
			setValues( prev => ( { ...prev, [ field ]: value } ) )
			setErrors( prev => ( { ...prev, [ field ]: undefined } ) )
			if ( submitError ) {
				setSubmitError( null )
			}
		}

	const handleSubmit = () => {
		const nextErrors = validate( values )
		const hasErrors = Object.values( nextErrors ).some( Boolean )

		setErrors( nextErrors )
		if ( hasErrors ) return

		mutate( {
			name: values.name.trim(),
			isu: values.isu.trim(),
			login: values.login.trim(),
			password: values.password,
			role: values.role,
			can_create_queues: values.role === 'teacher' || values.role === 'admin'
		} )
	}

	const handleCancel = () => {
		navigate( '/admin/users' )
	}

	return (
		<Page
			title='Создать аккаунт'
			subtitle='Добавьте учётную запись студента или преподавателя'
			sidebutton='user-list'
		>
			<div className='flex w-full max-w-4xl flex-col gap-6 rounded-card border border-border-subtle bg-bg-surface p-6 font-nunito'>
				<div className='flex flex-col gap-1'>
					<h2 className='text-section text-text-primary'>Данные аккаунта</h2>
					<p className='text-small text-text-secondary'>Все поля обязательны</p>
				</div>

				<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
					<UIInput
						label='Имя'
						value={ values.name }
						onChange={ handleChange( 'name' ) }
						placeholder='Введите имя'
						error={ errors.name }
						disabled={ isPending }
					/>

					<UIInput
						label='Табельный номер'
						value={ values.isu }
						onChange={ handleChange( 'isu' ) }
						placeholder='Введите табельный номер'
						error={ errors.isu }
						disabled={ isPending }
					/>

					<UIInput
						label='Логин'
						value={ values.login }
						onChange={ handleChange( 'login' ) }
						placeholder='Введите логин'
						error={ errors.login }
						disabled={ isPending }
					/>

					<UIInput
						label='Пароль'
						type='password'
						value={ values.password }
						onChange={ handleChange( 'password' ) }
						placeholder='Введите пароль'
						error={ errors.password }
						disabled={ isPending }
					/>

					<UISelect
						label='Роль'
						value={ values.role }
						onChange={ value => handleChange( 'role' )( value as UserRole ) }
						options={ ROLE_OPTIONS }
						error={ errors.role }
						disabled={ isPending }
						fullWidth
					/>
				</div>

				{ submitError && (
					<UIAlert
						tone={ UIAlertTone.ERROR }
						title='Ошибка создания аккаунта'
						message={ submitError }
					/>
				) }

				<div className='flex flex-wrap items-center justify-end gap-3 pt-2'>
					<UIButton
						label='Создать аккаунт'
						tone={ UIButtonTone.PRIMARY }
						onClick={ handleSubmit }
						loading={ isPending }
					/>
					<UIButton
						label='Отмена'
						tone={ UIButtonTone.SECONDARY }
						onClick={ handleCancel }
						disabled={ isPending }
					/>
				</div>
			</div>
		</Page>
	)
}
