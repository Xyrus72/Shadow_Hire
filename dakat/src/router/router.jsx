import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/rootlayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Home from "../pages/home/home.jsx";
import Login from "../pages/Auth/Login/Login.jsx";
import Register from "../pages/Auth/Register/Register.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import JobMatching from "../pages/JobMatching/JobMatching.jsx";
import TaskDashboard from "../pages/TaskDashboard/TaskDashboard.jsx";
import Payment from "../pages/Payment/Payment.jsx";
import Chat from "../pages/Chat/Chat.jsx";
import GadgetShop from "../pages/GadgetShop/GadgetShop.jsx";
import SkillManagement from "../pages/SkillManagement/SkillManagement.jsx";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard.jsx";
import ClientDashboard from "../pages/ClientDashboard/ClientDashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import RoleProtectedRoute from "../components/RoleProtectedRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { 
        path: "profile", 
        Component: () => (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      { 
        path: "jobs", 
        Component: () => (
          <ProtectedRoute>
            <JobMatching />
          </ProtectedRoute>
        )
      },
      { 
        path: "skills", 
        Component: () => (
          <ProtectedRoute>
            <SkillManagement />
          </ProtectedRoute>
        )
      },
      { 
        path: "dashboard", 
        Component: () => (
          <ProtectedRoute>
            <TaskDashboard />
          </ProtectedRoute>
        )
      },
      { 
        path: "payment", 
        Component: () => (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        )
      },
      { 
        path: "chat", 
        Component: () => (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        )
      },
      { 
        path: "shop", 
        Component: () => (
          <ProtectedRoute>
            <GadgetShop />
          </ProtectedRoute>
        )
      },
      { 
        path: "admin", 
        Component: () => (
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleProtectedRoute>
        )
      },
      { 
        path: "client-dashboard", 
        Component: () => (
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        )
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
]);