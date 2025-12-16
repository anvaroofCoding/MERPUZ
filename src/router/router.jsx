import Login from "@/auth/login";
import Error401 from "@/Errors/401/error-401";
import Error500 from "@/Errors/500/Error-500";
import Sidebar_Shadcn from "@/main/main-sidebar-shadcn.ui/sidebar_shadcn";
import Applications from "@/pages/application/aplication";
import Aplication_Detail from "@/pages/application/aplication_detail";
import ComingAppDetail from "@/pages/coming-applications/coming-app-detail";
import Coming_Applications from "@/pages/coming-applications/coming-applications";
import One_UseFul_Person from "@/pages/Created_Profile/one_useful_person";
import Useful_Person from "@/pages/Created_Profile/useful_person";
import Dashboard from "@/pages/dashboard/dashboard";
import Dash_Admin from "@/pages/head/dash-admin/dash_admin";
import SettingsPanel from "@/pages/setting/setting";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar_Shadcn />,
    children: [
      { path: "/Sozlamalar/:MainTitle", element: <SettingsPanel /> },
      { path: "/Dash/:MainTitle/:SubTitle", element: <Dash_Admin /> },
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
        path: "/Arizalar/:MainTitle/:SubTitle/:than_title/:id",
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
    ],
  },
  { path: "/no-token-and-go-login", element: <Login /> },
  { path: "/Error-500", element: <Error500 /> },
  { path: "/Error-401", element: <Error401 /> },
]);
