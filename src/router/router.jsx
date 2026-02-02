import Login from "@/auth/login";
import Error401 from "@/Errors/401/error-401";
import Error500 from "@/Errors/500/Error-500";
import Sidebar_Shadcn from "@/main/main-sidebar-shadcn.ui/sidebar_shadcn";
import Programm from "@/pages/About-programm/programm";
import Applications from "@/pages/application/aplication";
import Aplication_Detail from "@/pages/application/aplication_detail";
import ComingAppDetail from "@/pages/coming-applications/coming-app-detail";
import Coming_Applications from "@/pages/coming-applications/coming-applications";
import Created_PPR from "@/pages/Created-PPR/created-ppr";
import One_UseFul_Person from "@/pages/Created_Profile/one_useful_person";
import Useful_Person from "@/pages/Created_Profile/useful_person";
import Dashboard from "@/pages/dashboard/dashboard";
import YandexMapLocation from "@/pages/Obyekt/address";
import YandexMapEdit from "@/pages/Obyekt/address_edit";
import Obyekt from "@/pages/Obyekt/obyekt";
import YandexMapview from "@/pages/Obyekt/viewAddress";
import PprMonth from "@/pages/ppr.month/ppr.month";
import PprMonthDetails from "@/pages/ppr.month/ppr.month.details";
import PprYears from "@/pages/ppr_years/ppr.years";
import SettingsPanel from "@/pages/setting/setting";
import { createBrowserRouter } from "react-router-dom";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar_Shadcn />,
    children: [
      { path: "/Sozlamalar/:MainTitle", element: <SettingsPanel /> },
      { path: "/Kompleks/:MainTitle/:SubTitle", element: <Dashboard /> },
      {
        path: "/foydalanuvchilar/:MainTitle",
        element: <Useful_Person />,
      },
      {
        path: "/foydalanuvchilar/:MainTitle/:than_title/:id",
        element: <One_UseFul_Person />,
      },
      { path: "/me/:MainTitle/:SubTitle/:id", element: <One_UseFul_Person /> },
      {
        path: "/Arizalar/:MainTitle/:SubTitle",
        element: <Applications />,
      },
      {
        path: "/Arizalar/:MainTitle/:SubTitle/:than_title/:id/",
        element: <Aplication_Detail />,
      },

      {
        path: "/Kelgan-Arizalar/:MainTitle/:SubTitle",
        element: <Coming_Applications />,
      },
      {
        path: "/Kelgan-Arizalar/:MainTitle/:SubTitle/:than_title/:id",
        element: <ComingAppDetail />,
      },
      {
        path: "/PPRlar/:MainTitle/:SubTitle",
        element: <Created_PPR />,
      },
      {
        path: "/Obyektlar/:MainTitle/:SubTitle",
        element: <Obyekt />,
      },
      {
        path: "/Obyektlar/:MainTitle/:SubTitle/:than_title/:id",
        element: <YandexMapLocation />,
      },
      {
        path: "/Obyektlar/:MainTitle/:SubTitle/:than_title/:id/tahrirlash/:obyekt",
        element: <YandexMapEdit />,
      },
      {
        path: "/Obyektlar/:MainTitle/:SubTitle/:than_title/:lat/:lng",
        element: <YandexMapview />,
      },
      {
        path: "/yil/:MainTitle/:SubTitle",
        element: <PprYears />,
      },
      {
        path: "/oy/:MainTitle/:SubTitle",
        element: <PprMonth />,
      },
      {
        path: "/oy/:MainTitle/:SubTitle/:than_title/:id",
        element: <PprMonthDetails />,
      },
    ],
  },
  { path: "/no-token-and-go-login", element: <Login /> },
  { path: "/Error-500", element: <Error500 /> },
  { path: "/Error-401", element: <Error401 /> },
  {
    path: "/Programm/:MainTitle",
    element: <Programm />,
  },
]);
