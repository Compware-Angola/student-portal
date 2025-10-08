import Layout from "@/components/layout";
import { Dashboard } from "@/pages/dashboard";
import { Route } from "react-router-dom";

export function MainRoutes() {
    return (
        <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard/>}  />
        </Route>
    );
}