import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "./pages/auth/signIn";
import { SignUp } from "./pages/register/signUp";
import { AuthLayout } from "./pages/_layouts/authLayout";
import { AppLayout } from "./pages/_layouts/appLayout";
import { Home } from "./pages/app/home";
import { NotFound } from "./pages/error/404";
import { Profile } from "./pages/profile/profile";
import { Menu } from "./pages/menu/menu";
import { Order } from "./pages/order/order";
import { PromotionPage } from "./pages/promotion/promotion";
import { DishRegister } from "./pages/menu/productRegister";
import { DishEdit } from "./pages/menu/productEdit";
import { PromotionRegister } from "./pages/promotion/promotionRegister";
import { PromotionEdit } from "./pages/promotion/promotionEdit";
import { SuccessPage } from "./pages/register/successPage";
import { ErrorPage } from "./pages/register/errorPage"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />, 
    children: [
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "success-register", element: <SuccessPage /> }, 
      { path: "error-register", element: <ErrorPage /> },
    ],
  },
  {
    path: "/",
    element: <AppLayout />, 
    children: [
      { path: "home", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "menu", element: <Menu /> },
      { path: "order", element: <Order /> },
      { path: "promotion", element: <PromotionPage /> },
      { path: "dish-register", element: <DishRegister /> },
      { path: "dish-edit/:id", element: <DishEdit /> },
      { path: "promotion-register", element: <PromotionRegister /> },
      { path: "promotion-edit/:id", element: <PromotionEdit /> },
    ],
  },
  {
    path: "*", 
    element: <NotFound />,
  },
]);
