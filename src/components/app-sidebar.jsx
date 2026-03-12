import {
	AudioWaveform,
	BrainCog,
	Cog,
	Command,
	GalleryVerticalEnd,
	Gauge,
	ListPlus,
	NotebookPen,
	ScrollText,
	Users,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar'
import { useMEQuery } from '@/services/api'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function AppSidebar({ ...props }) {
	const { data: me, isLoading: meLoading } = useMEQuery()
	const navigate = useNavigate()
	const token = localStorage.getItem('access')
	if (!token) {
		navigate('/no-token-and-go-login')
	}
	const { data: supper, isLoading } = useMEQuery()
	const { t } = useTranslation()
	const data = {
		teams: [
			{
				name: 'Acme Inc',
				logo: GalleryVerticalEnd,
				plan: 'Enterprise',
			},
			{
				name: 'Acme Corp.',
				logo: AudioWaveform,
				plan: 'Startup',
			},
			{
				name: 'Evil Corp.',
				logo: Command,
				plan: 'Free',
			},
		],
		navMain: [
			{
				title: t('24_20251120'),
				url: '#',
				icon: ScrollText,
				items: [
					{
						title: 'Arizalar Yuborish',
						url: 'Arizalar',
						roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
					},
					{
						title: t('25_20251120'),
						url: 'Kelgan-Arizalar',
						roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
					},
					{
						title: 'Ariza Taqvim',
						url: 'Taqvim',
						roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
					},
				],
			},
			{
				title: t('26_20251120'),
				url: '#',
				icon: NotebookPen,
				items: [
					{
						title: 'PPR Taqvim',
						url: 'oy',
						roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
					},
				],
			},
			{
				title: t('29_20251120'),
				url: '#',
				icon: ListPlus,
				items: [
					{
						title: t('31_20251120'),
						url: 'PPRlar',
						roles: ['admin', 'bolim'],
					},
					{
						title: t('32_20251120'),
						url: 'Obyektlar',
						roles: ['admin', 'bolim'],
					},
				],
			},
			// {
			// 	title: 'Xaridlar',
			// 	url: '#',
			// 	icon: NotebookPen,
			// 	items: [
			// 		{
			// 			title: 'Xaridlar qilish',
			// 			url: 'xarid-qilish',
			// 			roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
			// 		},
			// 		{
			// 			title: 'Xaridlarni tastiqlash',
			// 			url: 'xarid-tastiqlash',
			// 			roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
			// 		},
			// 	],
			// },
		],
		projects: [
			{
				name: t('20_20251120'),
				url: '/Kompleks',
				icon: Gauge,
				roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
			},
			{
				name: t('37_20251120'),
				url: '/Programm',
				icon: BrainCog,
				roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
			},
			{
				name: 'Foydalanuvchilar',
				url: '/foydalanuvchilar',
				icon: Users,
				roles: ['admin', 'monitoring', 'tarkibiy', 'bekat'],
			},
			{
				name: t('38_20251120'),
				url: '/Sozlamalar',
				icon: Cog,
				roles: ['admin', 'monitoring', 'tarkibiy', 'bekat', 'bolim'],
			},
		],
	}
	if (meLoading) {
		return null
	}
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavProjects projects={data.projects} userRole={me?.role} />
				<NavMain items={data.navMain} userRole={me?.role} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser data={supper} isLoading={isLoading} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
