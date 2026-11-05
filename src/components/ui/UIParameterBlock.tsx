export type UIParameterBlockProps = {
	title: string
	value: string | number
	description: string
}

export const UIParameterBlock = ( {
	title,
	value,
	description
}: UIParameterBlockProps ) => (
	<div className='flex w-full min-w-0 flex-col gap-3 rounded-card bg-bg-page p-4 font-nunito text-text-primary'>
		<p className='text-label font-bold wrap-break-word'>{ title }</p>
		<p className='text-section font-bold wrap-break-word'>{ value }</p>
		<p className='text-small text-text-secondary wrap-break-word'>
			{ description }
		</p>
	</div>
)
