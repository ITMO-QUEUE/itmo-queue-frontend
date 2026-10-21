import { Footer } from '../common/Footer'
import { Header } from '../common/Header'
import { Sidebar } from '../common/Sidebar'

export const CommonLayout = () => {
	return (
		<>
			<Header />
			<Sidebar></Sidebar>
			<Footer />
		</>
	)
}
