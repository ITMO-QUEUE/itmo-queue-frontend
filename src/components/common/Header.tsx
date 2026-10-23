import { MyBreadcrumb } from './MyBreadcrumb'

export const Header = () => {
	return (
		<div className='p-6 w-full grid grid-cols-2'>
			<div className='flex justify-start'>
				<MyBreadcrumb />
			</div>
			<div className='flex justify-end'>Hello right</div>
		</div>
	)
}
