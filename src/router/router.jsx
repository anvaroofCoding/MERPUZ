import Login from "@/auth/login";
import Sidebar_Shadcn from "@/main/main-sidebar-shadcn.ui/sidebar_shadcn";
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
      //   { path: "nosozliklar/:defective_id", element: <Details /> },
    ],
  },
  { path: "/no-token-and-go-login", element: <Login /> },
]);
