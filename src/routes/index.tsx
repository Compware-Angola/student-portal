import { BrowserRouter, Routes } from "react-router";
import { AuthRoutes } from "./auth";
import { MainRoutes } from "./main";

export  function AppRoutes() {
  return (
        <BrowserRouter>
            <Routes>
             {AuthRoutes()}
             {MainRoutes()}
            </Routes>

        </BrowserRouter>
  );
}