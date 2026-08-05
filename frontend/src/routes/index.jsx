import { lazy } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

// Dashboards
const Dashboard = lazy(() => import("@/views/dashboards/dashboard"));

// Auth
const Login = lazy(() => import("@/views/auth/auth-1/sign-in/index"));
const Signup = lazy(() => import("@/views/auth/auth-1/sign-up/index"));
const ResetPassword = lazy(() => import("@/views/auth/auth-1/reset-password/index"));
const NewPassword = lazy(() => import("@/views/auth/auth-1/new-password/index"));

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
// Role Permissions
// ---------------------------
const ROLE_PERMISSIONS = {
  "site engineer": [
    "/dashboard",
    "/Inspection",
    "/add-report",
    "/report-history",
    "/asset/view",
    "/widgets",
  ],
  "project supervisor": ["*"], // full access
  admin: ["*"],                // full access
  "quality manager": ["/Defects"],
};

// Helper: get current user role from localStorage
const getUserRole = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    return userData?.type?.toLowerCase() || null;
  } catch {
    return null;
  }
};

// ---------------------------
// ProtectedRoute (Auth + Role)
// ---------------------------
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("authToken");
  const role = getUserRole();

  // Not logged in
  if (!token || !role) {
    return <Navigate to="/auth/login" replace />;
  }

  // Full access roles
  if (ROLE_PERMISSIONS[role]?.includes("*")) {
    return children;
  }

  // Check if current path is allowed for this role
  // (we pass the path pattern via allowedRoles prop)
  if (allowedRoles.length > 0) {
    const isAllowed = allowedRoles.some((path) =>
      ROLE_PERMISSIONS[role]?.some(
        (allowed) => path.startsWith(allowed) || allowed === path
      )
    );

    if (!isAllowed) {
      return <Navigate to="/error/403" replace />;
    }
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
          <ProtectedRoute allowedRoles={["/dashboard"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Inspection",
        element: (
          <ProtectedRoute allowedRoles={["/Inspection"]}>
            <Inspection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Defects",
        element: (
          <ProtectedRoute allowedRoles={["/Defects"]}>
            <Defects />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-report",
        element: (
          <ProtectedRoute allowedRoles={["/add-report"]}>
            <AddReport />
          </ProtectedRoute>
        ),
      },
      {
        path: "/report-history",
        element: (
          <ProtectedRoute allowedRoles={["/report-history"]}>
            <ReportHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/asset/view/:assetId",
        element: (
          <ProtectedRoute allowedRoles={["/asset/view"]}>
            <AssetDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/widgets",
        element: (
          <ProtectedRoute allowedRoles={["/widgets"]}>
            <Widgets />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

// ---------------------------
// Public routes
// ---------------------------
const publicRoutes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/auth-1/sign-up", element: <Signup /> },
  { path: "/auth-1/reset-password", element: <ResetPassword /> },
  { path: "/auth-1/new-password", element: <NewPassword /> },
  { path: "/landing", element: <Landing /> },
  { path: "/error/400", element: <Error400 /> },
  { path: "/error/401", element: <Error401 /> },
  { path: "/error/403", element: <Error403 /> },
  { path: "/error/404", element: <Error404 /> },
  { path: "/error/408", element: <Error408 /> },
  { path: "/error/500", element: <Error500 /> },
];

export const routes = [...mainLayoutRoutes, ...publicRoutes];