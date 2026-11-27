import { Outlet, useParams } from 'react-router'

export const StudentQueuesPage = () => {
	const { queueId } = useParams()

	if (queueId) {
		return <Outlet />
	}

	return (
		<div className='p-6'>
			<h1 className='text-section'>Найти очередь</h1>
		</div>
	)
}