import { lazy } from "react";
import { Navigate } from "react-router";
import MainLayout from "@/layouts/MainLayout";

// Dashboards
const Dashboard = lazy(() => import("@/views/dashboards/dashboard"));

// Auth
const Login = lazy(() => import("@/views/auth/auth-1/sign-in/index"));
const Signup = lazy(() => import("@/views/auth/auth-1/sign-up/index"));

// Landing
const Landing = lazy(() => import("@/views/landing"));

// Components
const Widgets = lazy(() => import("@/views/widgets"));

// Assets
const Inspection = lazy(() => import("@/views/drones/inspection"));
const Defects = lazy(() => import("@/views/drones/defects"));
const AddReport = lazy(() => import("@/views/drones/addReport"));
const ReportHistory = lazy(() => import("@/views/drones/reportHistory"));
const AssetDetails = lazy(() => import("@/views/drones/addReport/[assetId]"));

// Error
const Error400 = lazy(() => import("@/views/error/400"));
const Error401 = lazy(() => import("@/views/error/401"));
const Error403 = lazy(() => import("@/views/error/403"));
const Error404 = lazy(() => import("@/views/error/404"));
const Error408 = lazy(() => import("@/views/error/408"));
const Error500 = lazy(() => import("@/views/error/500"));

// ---------------------------
// ProtectedRoute Component
// ---------------------------
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

// ---------------------------
// Routes that require MainLayout
// ---------------------------
const mainLayoutRoutes = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Navigate to="/auth/login" replace /> },
      {
        path: "/dashboard",
        element: (
          // <ProtectedRoute>
            <Dashboard />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/Inspection",
        element: (
          // <ProtectedRoute>
            <Inspection />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/Defects",
        element: (
          // <ProtectedRoute>
            <Defects />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/add-report",
        element: (
          // <ProtectedRoute>
            <AddReport />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/report-history",
        element: (
          // <ProtectedRoute>
            <ReportHistory />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/asset/view/:assetId",
        element: (
          // <ProtectedRoute>
            <AssetDetails />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/widgets",
        element: (
          // <ProtectedRoute>
            <Widgets />
          // </ProtectedRoute>
        ),
      },
    ],
  },
];

// ---------------------------
// Routes without MainLayout (login, landing, errors)
// ---------------------------
const publicRoutes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/landing", element: <Landing /> },
  { path: "/error/400", element: <Error400 /> },
  { path: "/error/401", element: <Error401 /> },
  { path: "/error/403", element: <Error403 /> },
  { path: "/error/404", element: <Error404 /> },
  { path: "/error/408", element: <Error408 /> },
  { path: "/error/500", element: <Error500 /> },
];

// ---------------------------
// Export all routes
// ---------------------------
export const routes = [...mainLayoutRoutes, ...publicRoutes];
