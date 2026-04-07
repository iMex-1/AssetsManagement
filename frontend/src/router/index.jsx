import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppLayout } from '../components/layout/AppLayout'
import { ErrorPage } from '../pages/ErrorPage'
import { ComingSoon } from '../pages/ComingSoon'
import { Login } from '../pages/auth/Login'
import { Dashboard } from '../pages/dashboard/Dashboard'
import { ArticleList } from '../pages/articles/ArticleList'
import { ArticleForm } from '../pages/articles/ArticleForm'
import { ArticleShow } from '../pages/articles/ArticleShow'
import { FournisseurList } from '../pages/fournisseurs/FournisseurList'
import { FournisseurForm } from '../pages/fournisseurs/FournisseurForm'
import { UserList } from '../pages/users/UserList'
import { UserForm } from '../pages/users/UserForm'
import { RoleList } from '../pages/roles/RoleList'
import { RoleForm } from '../pages/roles/RoleForm'
import { PermissionList } from '../pages/permissions/PermissionList'
import { PermissionForm } from '../pages/permissions/PermissionForm'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const { token } = useAuth()
  return !token ? children : <Navigate to="/dashboard" replace />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <GuestRoute><Login /></GuestRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },

      // Articles
      { path: 'articles', element: <ArticleList /> },
      { path: 'articles/create', element: <ArticleForm /> },
      { path: 'articles/:id', element: <ArticleShow /> },
      { path: 'articles/:id/edit', element: <ArticleForm /> },

      // Fournisseurs
      { path: 'fournisseurs', element: <FournisseurList /> },
      { path: 'fournisseurs/create', element: <FournisseurForm /> },
      { path: 'fournisseurs/:id/edit', element: <FournisseurForm /> },

      // Users / Roles / Permissions
      { path: 'users', element: <UserList /> },
      { path: 'users/create', element: <UserForm /> },
      { path: 'users/:id/edit', element: <UserForm /> },
      { path: 'roles', element: <RoleList /> },
      { path: 'roles/create', element: <RoleForm /> },
      { path: 'roles/:id/edit', element: <RoleForm /> },
      { path: 'permissions', element: <PermissionList /> },
      { path: 'permissions/create', element: <PermissionForm /> },
      { path: 'permissions/:id/edit', element: <PermissionForm /> },

      // Coming soon
      { path: 'receptions', element: <ComingSoon title="Réceptions" /> },
      { path: 'demandes', element: <ComingSoon title="Demandes" /> },
      { path: 'affectations', element: <ComingSoon title="Affectations" /> },
      { path: 'rapports', element: <ComingSoon title="Rapports" /> },

      // Catch-all inside the app
      { path: '*', element: <ComingSoon title="Page introuvable" /> },
    ],
  },
])
