import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import './global.css';
import { App } from "./App";
import { RestaurantProvider } from "./pages/profile/context/restaurantContext";

createRoot(document.getElementById("root")!).render(
  <RestaurantProvider>
  <StrictMode>
    <App /> 
  </StrictMode>
  </RestaurantProvider>
);
