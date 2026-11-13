import { Page } from './Page.tsx'
import { UIButton, UIButtonTone } from '../ui/UIButton.tsx'
import { UIAlert, UIAlertTone } from '../ui/UIAlert.tsx'

export interface ProfileProps {

    name: string
    role: string
    login: string
    id: number
}

export const Profile = ({ name, role, login, id }: ProfileProps) => {
return (

    <Page
        title='Профиль'
	    subtitle='Данные вашей учётной записи'
    >
        <div className='w-full rounded-card border border-border-subtle bg-bg-surface p-6 font-nunito text-text-primary'>
            <div className='mb-4 text-section'>{name}</div>
            <div className='flex flex-col gap-3'>
                {[
                    ['Назначенная роль', role],
                    ['Логин', login],
                    ['Табельный номер', id],
                ].map(([label, value]) => (
                    <div key={label} className='grid grid-cols-[15em_minmax(0,1fr)] items-start'>
                        <div className='min-w-0 pr-4 text-small text-text-secondary [overflow-wrap:anywhere]'>
                            {label}
                        </div>
                        <div className='min-w-0 text-label [overflow-wrap:anywhere]'>
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <UIAlert 
                tone = {UIAlertTone.INFO} 
                message = 'Для изменения идентификационных данных или решения проблем со входом обратитесь к ответственному за доступ.' 
                title = 'Данные аккаунта задаёт администратор'
            />
        </div>
        <div>
            <UIButton
                label='Выйти из аккаунта'
                onClick={() => {}}
                tone={UIButtonTone.SECONDARY}
            />
        </div>
        <p className='text-small text-text-secondary'>
            Выход не отменяет ваши записи и не закрывает сеансы.
        </p> 
    </Page> 
)
}
