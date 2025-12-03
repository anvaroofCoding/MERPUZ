import Login from "@/auth/login";
import Sidebar_Shadcn from "@/main/main-sidebar-shadcn.ui/sidebar_shadcn";
import Applications from "@/pages/application/aplication";
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
    ],
  },
  { path: "/no-token-and-go-login", element: <Login /> },
]);
