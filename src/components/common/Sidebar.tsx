import type { ReactNode } from 'react'
import logo from '@/assets/Logo.svg'

interface SidebarProps {
	children: ReactNode[]
}

export const Sidebar = ({ children }: SidebarProps) => {
	return (
		<div className='select-none flex flex-col gap-7 align-center w-full h-full  bg-white border-r border-border-subtle p-6'>
			<img
				draggable={false}
				src={logo}
				alt='logo'
			/>

			<div className='width-full flex flex-col gap-2'>{children}</div>
		</div>
	)
}
