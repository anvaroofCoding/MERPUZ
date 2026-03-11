import { createBrowserRouter, Navigate } from 'react-router-dom'

import AuthProtected from './AuthProtected'
import RoleProtected from './RoleProtected'

// 🌍 Public pages
import Error401 from '@/Errors/401/error-401'
import Error500 from '@/Errors/500/Error-500'
import Error_Page from '@/Errors/main/Error_Page'
import Programm from '@/pages/About-programm/programm'

// 🔐 Private Layout
import Sidebar_Shadcn from '@/main/main-sidebar-shadcn.ui/sidebar_shadcn'

// 📄 Pages
import Login from '@/auth/login'
import Taqvim from '@/pages/application-taqvim/taqvim'
import Applications from '@/pages/application/aplication'
import Aplication_Detail from '@/pages/application/aplication_detail'
import ComingAppDetail from '@/pages/coming-applications/coming-app-detail'
import Coming_Applications from '@/pages/coming-applications/coming-applications'
import Created_PPR from '@/pages/Created-PPR/created-ppr'
import One_UseFul_Person from '@/pages/Created_Profile/one_useful_person'
import Useful_Person from '@/pages/Created_Profile/useful_person'
import Dashboard from '@/pages/dashboard/dashboard'
import YandexMapLocation from '@/pages/Obyekt/address'
import YandexMapEdit from '@/pages/Obyekt/address_edit'
import Obyekt from '@/pages/Obyekt/obyekt'
import YandexMapview from '@/pages/Obyekt/viewAddress'
import PprMonth from '@/pages/ppr.month/ppr.month'
import PprMonthDetails from '@/pages/ppr.month/ppr.month.details'
import SettingsPanel from '@/pages/setting/setting'
import Counter from '@/pages/test/test'
import XaridQilish from '@/pages/Xarid/xarid-qilish'
import XaridTastiqlash from '@/pages/Xarid/xarid-tastiqlash'

export const router = createBrowserRouter([
	// =========================
	// 🌍 PUBLIC ROUTES
	// =========================
	{ path: '/no-token-and-go-login', element: <Login /> },
	{ path: '/Error-401', element: <Error401 /> },
	{ path: '/Error-500', element: <Error500 /> },
	{ path: '*', element: <Error_Page /> },

	// =========================
	// 🔐 PRIVATE ROUTES
	// =========================
	{
		element: <AuthProtected />, // faqat login borligini tekshiradi
		children: [
			{
				path: '/',
				element: <Sidebar_Shadcn />,
				children: [
					// 🏠 ROOT → Dashboardga o‘tadi
					{
						index: true,
						element: <Navigate to='Kompleks/Bosh sahifa/' replace />,
					},

					{ path: 'test', element: <Counter /> },

					// =========================
					// DASHBOARD
					// =========================
					{
						path: 'Kompleks/:MainTitle/',
						element: <Dashboard />,
					},

					{
						path: 'Taqvim/:MainTitle/:than_title',
						element: <Taqvim />,
					},

					// =========================
					// SETTINGS
					// =========================
					{
						path: 'Sozlamalar/:MainTitle',
						element: (
							<RoleProtected
								allowedRoles={['monitoring', 'tarkibiy', 'bekat', 'bolim']}
							>
								<SettingsPanel />
							</RoleProtected>
						),
					},

					{ path: '/Programm/:MainTitle', element: <Programm /> },

					// =========================
					// USERS
					// =========================
					{
						path: 'foydalanuvchilar/:MainTitle',
						element: (
							<RoleProtected allowedRoles={['monitoring', 'tarkibiy', 'bekat']}>
								<Useful_Person />
							</RoleProtected>
						),
					},
					{
						path: 'foydalanuvchilar/:MainTitle/:than_title/:id',
						element: <One_UseFul_Person />,
					},
					{
						path: 'me/:MainTitle/:SubTitle/:id',
						element: <One_UseFul_Person />,
					},

					// =========================
					// APPLICATIONS
					// =========================
					{
						path: 'Arizalar/:MainTitle/:SubTitle',
						element: <Applications />,
					},
					{
						path: 'Arizalar/:MainTitle/:SubTitle/:than_title/:id',
						element: <Aplication_Detail />,
					},
					{
						path: 'Kelgan-Arizalar/:MainTitle/:SubTitle',
						element: <Coming_Applications />,
					},
					{
						path: 'Kelgan-Arizalar/:MainTitle/:SubTitle/:than_title/:id',
						element: <ComingAppDetail />,
					},

					{
						path: 'xarid-qilish/:MainTitle/:SubTitle/',
						element: <XaridQilish />,
					},

					{
						path: 'xarid-tastiqlash/:MainTitle/:SubTitle/',
						element: <XaridTastiqlash />,
					},

					// =========================
					// PPR
					// =========================
					{
						path: 'PPRlar/:MainTitle/:SubTitle',
						element: (
							<RoleProtected allowedRoles={['bolim']}>
								<Created_PPR />
							</RoleProtected>
						),
					},

					// =========================
					// OBYEKT
					// =========================
					{
						path: 'Obyektlar/:MainTitle/:SubTitle',
						element: (
							<RoleProtected allowedRoles={['bolim']}>
								<Obyekt />
							</RoleProtected>
						),
					},
					{
						path: 'Obyektlar/:MainTitle/:SubTitle/:than_title/:id',
						element: <YandexMapLocation />,
					},
					{
						path: 'Obyektlar/:MainTitle/:SubTitle/:than_title/:id/tahrirlash/:obyekt',
						element: <YandexMapEdit />,
					},
					{
						path: 'Obyektlar/:MainTitle/:SubTitle/:than_title/:lat/:lng',
						element: <YandexMapview />,
					},

					// =========================
					// OYLIK
					// =========================
					{
						path: 'oy/:MainTitle/:SubTitle',
						element: <PprMonth />,
					},
					{
						path: 'oy/:MainTitle/:SubTitle/:than_title/:id',
						element: <PprMonthDetails />,
					},
				],
			},
		],
	},
])
