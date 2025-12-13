// Auth feature public API
export { AuthModal, loginSchema, registerSchema, roleOptions, getPasswordStrength } from './components/AuthModal';
export type { LoginFormData, RegisterFormData, AuthModalType } from './components/AuthModal';
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { AuthProvider, useAuth, useUserRole, useHasRole } from '@/features/auth';
export { AuthModalProvider, useAuthModal } from './contexts/AuthModalContext';
