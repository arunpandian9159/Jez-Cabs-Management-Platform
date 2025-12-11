import { useState } from 'react';
import { AuthModalType } from './AuthModal';

export const useAuthModal = () => {
    const [modalType, setModalType] = useState<AuthModalType>(null);

    const openLogin = () => setModalType('login');
    const openRegister = () => setModalType('register');
    const closeModal = () => setModalType(null);

    return {
        modalType,
        openLogin,
        openRegister,
        closeModal,
        setModalType
    };
};
