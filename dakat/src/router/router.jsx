import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/rootlayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Home from "../pages/home/home.jsx";
import Login from "../pages/Auth/Login/Login.jsx";
import Register from "../pages/Auth/Register/Register.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import JobMatching from "../pages/JobMatching/JobMatching.jsx";
import Chat from "../pages/Chat/Chat.jsx";
import TaskDashboard from "../pages/TaskDashboard/TaskDashboard.jsx";
import Ratings from "../pages/Ratings/Ratings.jsx";
import Payment from "../pages/Payment/Payment.jsx";
import Chatbot from "../pages/Chatbot/Chatbot.jsx";
import GadgetShop from "../pages/GadgetShop/GadgetShop.jsx";
import SkillManagement from "../pages/SkillManagement/SkillManagement.jsx";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard.jsx";
import DeveloperDashboard from "../pages/DeveloperDashboard/DeveloperDashboard.jsx";
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
        path: "ratings", 
        Component: () => (
          <ProtectedRoute>
            <Ratings />
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
        path: "support", 
        Component: () => (
          <ProtectedRoute>
            <Chatbot />
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
        path: "developer-dashboard", 
        Component: () => (
          <RoleProtectedRoute allowedRoles={['developer']}>
            <DeveloperDashboard />
          </RoleProtectedRoute>
        )
      },
      { 
        path: "client-dashboard", 
        Component: () => (
          <RoleProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </RoleProtectedRoute>
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