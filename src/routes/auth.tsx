import { LoginPage } from "@/pages/login";
import { Route } from "react-router-dom";

export function AuthRoutes() {
    return (
        <Route path="/auth">
            <Route path="login" element={<LoginPage />} />
        </Route>
    );
}