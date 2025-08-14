import { createContext, useContext, useState } from 'react';

type UserRole = 'aluno' | 'monitor' | 'professor' | 'coordenador' | null;

interface AuthContextType {
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
    userRole: null,
    setUserRole: () => { },
});

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState<UserRole>(null);

    return (
        <AuthContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
