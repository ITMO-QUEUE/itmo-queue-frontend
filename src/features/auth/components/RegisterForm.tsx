import { useState, type FormEvent } from 'react'
import { UIInput } from '@/components/ui/UIInput'

export const RegisterForm = () => {
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitted(true)
    }

    const filled = Boolean(name.trim() && number.trim() && login.trim() && password)

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <UIInput
                label='Имя'
                placeholder='Максим Ковзик'
                value={name}
                onChange={setName}
                error={submitted && !name.trim() ? 'Введите имя' : undefined}
            />
            <UIInput
                label='Табельный номер'
                placeholder='123456'
                value={number}
                onChange={setNumber}
                error={submitted && !number.trim() ? 'Введите табельный номер' : undefined}
            />
            <UIInput
                label='Логин'
                placeholder='m.kovzik'
                value={login}
                onChange={setLogin}
                error={submitted && !login.trim() ? 'Введите логин' : undefined}
            />
            <UIInput
                label='Пароль'
                type='password'
                placeholder='Введите пароль'
                value={password}
                onChange={setPassword}
                error={submitted && !password ? 'Введите пароль' : undefined}
            />
            <button
                type='submit'
                className='h-11 w-full rounded-control bg-action-primary text-label text-text-inverse hover:bg-action-hover'
            >
                Зарегистрироваться
            </button>
            {submitted && filled && (
                <p role='status' className='text-small text-text-secondary'>
                    Форма заполнена. Создание аккаунта будет доступно после подключения к серверу.
                </p>
            )}
        </form>
    )
}