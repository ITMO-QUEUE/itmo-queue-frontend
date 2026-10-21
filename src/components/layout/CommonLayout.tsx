import { Outlet } from 'react-router'
import { Header } from '../common/Header'
import { Sidebar } from '../common/Sidebar'

export const CommonLayout = () => {
	return (
		<div className='grid h-screen grid-cols-[250px_1fr] grid-rows-[auto_1fr] overflow-hidden'>
			<aside className='row-span-2'>
				<Sidebar />
			</aside>

			<header>
				<Header />
			</header>

			<main className='overflow-y-scroll'>
				<Outlet />
			</main>
		</div>
	)
}
