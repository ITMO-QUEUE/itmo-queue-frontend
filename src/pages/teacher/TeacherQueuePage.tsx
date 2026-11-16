import { mockFullQueues } from '../../features/queue-teacher/mocks/FullQueues.ts';
import { Page } from '../../components/common/Page.tsx'

export const TeacherQueuePage = () => {
	const Queue = fullMockQueue[0]

	return (
		<Page
			ame = 'Елена Ивановна'
			role = 'Преподаватель'
			login = 'e.ivanova'
			id = {112233}
		>
		</Page>
	)
}
