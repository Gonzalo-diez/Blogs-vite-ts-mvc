import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
    userId: string | null;
    isAuthenticated: boolean;
    setAuthenticatedUserId: (id: string | null) => void;
}

const initialAuthContext: AuthContextType = {
    userId: null,
    isAuthenticated: false,
    setAuthenticatedUserId: () => { },
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const setAuthenticatedUserId = (id: string | null) => {
        setUserId(id);
        setIsAuthenticated(!!id);
    };

    const authContextValue: AuthContextType = {
        userId,
        isAuthenticated,
        setAuthenticatedUserId,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext);
};
