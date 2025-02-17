import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignIn } from "./pages/auth/signIn";
import { SignUp } from "./pages/register/signUp";
import { AuthLayout } from "./pages/_layouts/authLayout";
import { AppLayout } from "./pages/_layouts/appLayout";
import { Home } from "./pages/app/home";
import { NotFound } from "./pages/error/404";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/sign-up" replace /> }, // Redireciona para /sign-up
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
    ],
  },
  {
    path: "/app", // Usando um prefixo diferente para rotas da aplicação
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> }, // Rota padrão para /app
      { path: "home", element: <Home /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);