import { createBrowserRouter } from "react-router-dom";


import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";

import { PrivateRoutes } from "./PrivateRoutes";
import Dashboard from "@/components/pages/Dashboard";
import TransactionPage from "@/components/pages/TransactionPage";
import CashbooksPage from "@/components/pages/CashbooksPage";
import BusinessesPage from "@/components/pages/BusinessesPage";
import {
  BusinessMembersPage,
  CategoriesPage,
  ContactsPage,
  ReportsPage,
  SettingsPage,
} from "@/components/pages/ManagementPages";
import ErrorPage from "./ErrorPage";
import Layout from "@/pages/Layout";


const router = createBrowserRouter([
  // ==========================================
  // PUBLIC ROUTES
  // ==========================================
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },

  // ==========================================
  // PRIVATE ROUTES
  // ==========================================
  {
    element: <PrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "transactions",
        element: <TransactionPage />,
      },
      {
        path: "cashbooks",
        element: <CashbooksPage />,
      },
      {
        path: "businesses",
        element: <BusinessesPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "contacts",
        element: <ContactsPage />,
      },
      {
        path: "business-members",
        element: <BusinessMembersPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;