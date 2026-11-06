import { Page } from '../../components/common/Page.tsx'; 
import { Profile } from '../../components/common/Profile.tsx'

export const StudentProfilePage = () => {
	return (
		<Profile
			name = 'Максим Ковзик'
			role = 'Студент'
			login = 'm.kovzik	'
			id = {123456}
		/>
	)
}
