import type { ReactNode } from 'react'
import logo from '@/assets/Logo.svg'

interface SidebarProps {
	children: ReactNode[]
}

export const Sidebar = ( { children }: SidebarProps ) => {
	return (
		<div className='flex flex-col gap-7 align-center w-full h-full  bg-white border-r border-c-border p-6'>
			<img
				src={ logo }
				alt='logo'
			/>

			<div className='width-full flex flex-col gap-2'>{ children }</div>
		</div>
	)
}
