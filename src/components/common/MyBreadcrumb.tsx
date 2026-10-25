import { Link, useLocation } from 'react-router'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '../ui/breadcrumb'

export const MyBreadcrumb = () => {
	const location = useLocation()
	const locationParts = location.pathname.split('/').filter(Boolean)
	const separator = '/'

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{locationParts.map((part, index) => {
					return (
						<>
							<BreadcrumbItem key={index}>
								{index === locationParts.length - 1 ?
									<BreadcrumbPage>{part}</BreadcrumbPage>
								:	<BreadcrumbLink
										render={
											<Link
												to={`/${locationParts.slice(0, index + 1).join('/')}`}
											>
												{part}
											</Link>
										}
									/>
								}
							</BreadcrumbItem>
							<BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
						</>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
