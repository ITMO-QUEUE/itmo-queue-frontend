export interface PageProps {
	children: React.ReactNode
	title: string
	subtitle?: string
}

export const Page = ({ children, title, subtitle }: PageProps) => {
	return (
		<div className='bg-bg-page flex flex-col w-full h-auto p-content gap-6'>
			<h1 className='text-heading '>{title}</h1>
			{subtitle && <p className='text-small'>{subtitle}</p>}
			{children}
		</div>
	)
}
