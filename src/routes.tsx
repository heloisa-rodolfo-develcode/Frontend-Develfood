import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignIn } from "./pages/auth/signIn";
import { SignUp } from "./pages/register/signUp";
import { AuthLayout } from "./pages/_layouts/authLayout";
import { AppLayout } from "./pages/_layouts/appLayout";
import { Home } from "./pages/app/home";
import { NotFound } from "./pages/error/404";
import { Profile } from "./pages/profile/profile";
import { Menu } from "./pages/menu/menu";
import { OrderPage } from "./pages/order/order";
import { DishRegister } from "./pages/menu/productRegister";
import { DishEdit } from "./pages/menu/productEdit";
import { ChangePassword } from "./pages/changePassword/changePassword";
import { PromotionPage } from "./promotion/promotion";
import { PromotionRegister } from "./promotion/promotionRegister";
import { PromotionEdit } from "./promotion/promotionEdit";
import { ProtectedRoute } from "./components/protectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Navigate to="/sign-in" replace /> }, 
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "change-password", element: <ChangePassword /> },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { path: "home", element: <Home /> },
          { path: "profile", element: <Profile /> },
          { path: "menu", element: <Menu /> },
          { path: "order", element: <OrderPage /> },
          { path: "promotion", element: <PromotionPage /> },
          { path: "dish-register", element: <DishRegister /> },
          { path: "dish-edit/:id", element: <DishEdit /> },
          { path: "promotion-register", element: <PromotionRegister /> },
          { path: "promotion-edit/:id", element: <PromotionEdit /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);