import { createContext, useContext } from "react";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export default AdminAuthContext;
