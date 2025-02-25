import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignIn } from "./pages/auth/signIn";
import { SignUp } from "./pages/register/signUp";
import { AuthLayout } from "./pages/_layouts/authLayout";
import { AppLayout } from "./pages/_layouts/appLayout";
import { Home } from "./pages/app/home";
import { NotFound } from "./pages/error/404";
import { Menu } from "./pages/menu/menu";
import { DishRegister } from "./pages/menu/productRegister";
import { DishEdit } from "./pages/menu/productEdit";
import { Profile } from "./pages/profile/profile";
import { Order } from "./pages/order/order";
import { Promotion } from "./pages/promotion/promotion";
import { PromotionRegister } from "./pages/promotion/promotionRegister";
import { PromotionEdit } from "./pages/promotion/promotionEdit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/sign-in" replace /> }, 
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
    ],
  },
  {
    path: "/", 
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> }, 
      { path: "home", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "menu", element: <Menu /> },
      { path: "order", element: <Order /> },
      { path: "promotion", element: <Promotion /> },
      { path: "dish-register", element: <DishRegister /> },
      { path: "dish-edit/:id", element: <DishEdit /> },
      { path: "promotion-register", element: <PromotionRegister /> },
      { path: "promotion-edit", element: <PromotionEdit /> },
    ],
  },
  {
    path: "*", 
    element: <NotFound />,
  },
]);