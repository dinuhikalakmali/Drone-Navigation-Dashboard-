import { Container } from "react-bootstrap";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import UserRoleManagement from "./components/UserRoleManagement";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Settings = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const userType = userData?.type?.toLowerCase();
            setIsAdmin(userType === "admin");
        } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <Container fluid className="py-3">
                <PageBreadcrumb title="Settings" subtitle="System" />
                <div className="text-center py-5">
                    <p>Loading...</p>
                </div>
            </Container>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/error/403" replace />;
    }

    return (
        <Container fluid className="py-3">
            <PageBreadcrumb title="Settings" subtitle="System" />
            <UserRoleManagement />
        </Container>
    );
};

export default Settings;
