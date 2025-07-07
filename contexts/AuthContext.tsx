import {createContext, ReactNode, useContext, useState} from 'react';
import {login as loginService} from '@/services/authService';
import {LoginResponseDTO} from "@/dto/Auth";

type AuthContextType = {
    authenticatedUser: null | LoginResponseDTO;
    login: (email: string, password: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    authenticatedUser: null,
    login: () => {
    },
    logout: () => {
    },
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [authenticatedUser, setUser] = useState<null | LoginResponseDTO>(null);

    const login = (email: string, password: string) => {
        console.log("login için ", email, password);
        loginService(email, password)
            .then(r => setUser(r))
            .catch(e => console.log(e));
    };

    const logout = () => setUser(null);

    return <AuthContext.Provider value={{authenticatedUser, login, logout}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);