import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AuthModalType } from './AuthModal';

interface AuthModalContextType {
    modalType: AuthModalType;
    openLogin: () => void;
    openRegister: () => void;
    closeModal: () => void;
    setModalType: (type: AuthModalType) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [modalType, setModalType] = useState<AuthModalType>(null);

    const openLogin = useCallback(() => setModalType('login'), []);
    const openRegister = useCallback(() => setModalType('register'), []);
    const closeModal = useCallback(() => setModalType(null), []);

    return (
        <AuthModalContext.Provider
            value={{
                modalType,
                openLogin,
                openRegister,
                closeModal,
                setModalType
            }}
        >
            {children}
        </AuthModalContext.Provider>
    );
}

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
};
