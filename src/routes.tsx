import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "./pages/auth/signIn";
import { SignUp } from "./pages/register/signUp";
import { AuthLayout } from "./pages/_layouts/authLayout";
import { AppLayout } from "./pages/_layouts/appLayout";
import { Home } from "./pages/app/home";
import { NotFound } from "./pages/error/404";
import { Profile } from "./pages/profile/profile";
import { Menu } from "./pages/menu/menu";
import { DishRegister } from "./pages/menu/productRegister";
import { DishEdit } from "./pages/menu/productEdit";
import { SuccessPage } from "./pages/register/successPage";
import { ErrorPage } from "./pages/register/errorPage";
import { OrderPage } from "./pages/order/order";
import { PromotionPage } from "./promotion/promotion";
import { PromotionRegister } from "./promotion/promotionRegister";
import { PromotionEdit } from "./promotion/promotionEdit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, 
    children: [
    
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "menu", element: <Menu /> }, 
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
  {
    path: "/auth", // Mudei o prefixo para /auth
    element: <AuthLayout />,
    children: [
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "success-register", element: <SuccessPage /> },
      { path: "error-register", element: <ErrorPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);