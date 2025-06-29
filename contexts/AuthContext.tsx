import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
    user: null | { name: string };
    login: (email: string, password: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<null | { name: string }>(null);

    const login = (email: string, password: string) => {
        // Fake login
        setUser({ name: email });
    };

    const logout = () => setUser(null);

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);