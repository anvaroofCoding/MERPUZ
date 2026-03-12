import InteractiveDashboard from './charter_line'
import Dashboard_ppr_statistika from './dashboard_ppr_statistika'
import { SectionCards } from './second_card'

export default function Dashboard() {
	return (
		<div className='flex flex-1 flex-col'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				{/* <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards />
        </div> */}
				<div>
					<SectionCards />
				</div>
				<div>
					<Dashboard_ppr_statistika />
				</div>
				<div className='mt-2'>
					<InteractiveDashboard />
				</div>
			</div>
		</div>
	)
}
