import { BrowserRouter, Routes } from "react-router";
import { AuthRoutes } from "./auth";

export  function AppRoutes() {
  return (
        <BrowserRouter>
            <Routes>
             {AuthRoutes()}
            </Routes>
                
        </BrowserRouter>
  );
}