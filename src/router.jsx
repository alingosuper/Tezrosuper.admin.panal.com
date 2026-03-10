import { createBrowserRouter } from "react-router-dom";
import AppShell from "./AppShell";
import AdminDashboard from "./screens/Admin/AdminDashboard";
import AdminLogin from "./screens/Auth/AdminLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />, // سائیڈ بار ہر صفحے پر رہے گا
    children: [
      { path: "/", element: <AdminDashboard /> },
      // یہاں آپ مزید صفحات جیسے /security یا /web-manager بھی شامل کر سکتے ہیں
    ]
  },
  { path: "/login", element: <AdminLogin /> }
]);

export default router;
