import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/shared/constants';
import { AuthModal, useAuthModal } from '@/features/auth';


import { Navbar } from './Navbar';


const navLinks = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: '/#services', label: 'Services' },
    { path: '/#how-it-works', label: 'How It Works' },
    { path: '/#fleet', label: 'Fleet' },
    { path: '/#for-owners', label: 'For Owners' },
];

export function PublicLayout() {
    const { modalType, closeModal, setModalType } = useAuthModal();
    const location = useLocation();

    // Note: Auth modal closing is handled by navigation after successful login

    return (
        <div className="min-h-screen bg-white">
            <Navbar variant="public" publicLinks={navLinks} />

            {/* Main content */}
            <main className="pt-16 md:pt-20 pb-20 lg:pb-0">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Auth Modal */}
            <AuthModal
                isOpen={modalType !== null}
                modalType={modalType}
                onClose={closeModal}
                onSwitchModal={setModalType}
            />
        </div>
    );
}
