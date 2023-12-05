import { useContext } from "react";
import { AuthAction, AuthContext } from "../context/AuthContext";

interface AuthContextProps {
    user: null | { id: number; name: string }; // Adjust the user type accordingly
    token: string;
    isAuthenticated: boolean;
    dispatch: React.Dispatch<AuthAction>;
}

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
