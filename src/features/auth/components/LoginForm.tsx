import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import {
	AlertAccountBanned,
	AlertBadCredentials,
	AlertServiceUnavailable
} from '@/features/auth/components/Alerts.tsx'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UIInput } from '../../../components/ui/UIInput'
import { useAuthStore } from '../../../stores/useAuthStore'
import { loginAndFetchProfile } from '../api/authApi'

interface LoginValues {
	login: string
	password: string
}

type LoginErrors = Partial< Record< keyof LoginValues, string > >
type AuthAlertType = 'bad_credentials' | 'banned' | 'unavailable' | null

const EMPTY_VALUES: LoginValues = { login: '', password: '' }

const validate = ( values: LoginValues ): LoginErrors => ( {
	login: values.login.trim() ? undefined : 'Введите логин',
	password: values.password ? undefined : 'Введите пароль'
} )

const mapErrorToAlert = ( error: unknown ): AuthAlertType => {
	if ( ! isAxiosError( error ) || ! error.response ) {
		return 'unavailable'
	}

	const status = error.response.status

	if ( status === 401 || status === 422 ) {
		return 'bad_credentials'
	}

	if ( status === 403 ) {
		return 'banned'
	}

	return 'unavailable'
}

export const LoginForm = () => {
	const [ values, setValues ] = useState( EMPTY_VALUES )
	const [ errors, setErrors ] = useState< LoginErrors >( {} )
	const [ alertType, setAlertType ] = useState< AuthAlertType >( null )

	const loginToStore = useAuthStore( state => state.login )

	const navigate = useNavigate()

	const { mutate, isPending } = useMutation( {
		mutationFn: loginAndFetchProfile,
		onSuccess: userProfile => {
			if ( ! userProfile.is_active ) {
				setAlertType( 'banned' )
				return
			}

			setAlertType( null )
			loginToStore( userProfile )

			switch ( userProfile.role ) {
				case 'teacher': {
					navigate( '/teacher' )
					break
				}
				case 'student': {
					navigate( '/student' )
					break
				}
				case 'admin': {
					navigate( '/admin' )
					break
				}
				default: {
					throw new Error( 'Unknown user role' )
				}
			}
		},
		onError: error => {
			setAlertType( mapErrorToAlert( error ) )
		}
	} )

	const handleChange = ( field: keyof LoginValues ) => ( value: string ) => {
		setValues( prev => ( { ...prev, [ field ]: value } ) )
		setErrors( prev => ( { ...prev, [ field ]: undefined } ) )
		if ( alertType ) {
			setAlertType( null )
		}
	}

	const handleSubmit = ( e?: FormEvent ) => {
		e?.preventDefault()

		const nextErrors = validate( values )
		const hasErrors = Boolean( nextErrors.login || nextErrors.password )

		setErrors( nextErrors )
		if ( hasErrors ) return

		mutate( {
			login: values.login.trim(),
			password: values.password
		} )
	}

	return (
		<form
			onSubmit={ handleSubmit }
			className='flex flex-col gap-5'
		>
			<UIInput
				label='Логин'
				value={ values.login }
				onChange={ handleChange( 'login' ) }
				placeholder='Введите логин'
				error={ errors.login }
			/>
			<UIInput
				label='Пароль'
				type='password'
				value={ values.password }
				onChange={ handleChange( 'password' ) }
				placeholder='Введите пароль'
				error={ errors.password }
			/>

			{ alertType === 'bad_credentials' && <AlertBadCredentials /> }
			{ alertType === 'banned' && <AlertAccountBanned /> }
			{ alertType === 'unavailable' && <AlertServiceUnavailable /> }

			<UIButton
				label={ isPending ? 'Вход...' : 'Войти' }
				tone={ UIButtonTone.PRIMARY }
				onClick={ () => handleSubmit() }
				fullWidth
				disabled={ isPending }
				loading={ isPending }
			/>
		</form>
	)
}
