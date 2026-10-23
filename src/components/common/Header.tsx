import { useAuthStore } from '../../stores/useAuthStore'
import { MyBreadcrumb } from './MyBreadcrumb'

export const Header = () => {
	const { user } = useAuthStore()
	const { name, type } = user || { name: 'Джон Дое', type: 'student' }
	const shownType = type === 'student' ? 'Студент' : 'Преподаватель'
	const initials = name
		.split(' ')
		.map(n => n[0])
		.join('')
		.toUpperCase()

	return (
		<div className='p-6 w-full grid grid-cols-2'>
			<div className='flex justify-start'>
				<MyBreadcrumb />
			</div>
			<div className='flex gap-6 justify-end align-center text-c-text-ink text-sm'>
				<button className='cursor-pointer'>Уведомления</button>
				<div className='p-2 rounded-full bg-c-bg-foam flex justify-center items-center text-c-text-ink font-bold'>
					{initials}
				</div>
				<span className='h-full flex items-center'>
					{name} · {shownType}
				</span>
			</div>
		</div>
	)
}
