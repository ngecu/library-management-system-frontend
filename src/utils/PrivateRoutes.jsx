import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Layout from "../screens/Admin/Layout"; // Assuming Layout is for Librarians
import PatronLayout from "../screens/Patron/PatronLayout";

const PrivateRoutes = () => {
  const { isAuthenticated, role } = useAuth();
  console.log("is authenticated:", isAuthenticated);
  console.log("role:", role);

  // Conditional rendering based on authentication and role
  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  return role === "LIBRARIAN" ? <Layout /> : <PatronLayout />;
};

export default PrivateRoutes;
