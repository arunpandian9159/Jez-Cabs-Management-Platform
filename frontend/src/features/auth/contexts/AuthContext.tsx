import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/shared/utils';
import { apiClient } from '@/shared/api';
import { STORAGE_KEYS, ROUTES } from '@/shared/constants';
import type { User, AuthState, LoginCredentials, RegisterData, AuthResponse, UserRole } from '@/types';


interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleHomePaths: Record<UserRole, string> = {
    customer: ROUTES.CUSTOMER.DASHBOARD,
    driver: ROUTES.DRIVER.DASHBOARD,
    cab_owner: ROUTES.OWNER.DASHBOARD,
    trip_planner: ROUTES.PLANNER.DASHBOARD,
    admin: ROUTES.ADMIN.DASHBOARD,
    support: ROUTES.SUPPORT.DASHBOARD,
};


export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Initialize auth state from storage
    useEffect(() => {
        const initAuth = async () => {
            const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
            const user = storage.get<User>(STORAGE_KEYS.USER);

            if (token && user) {
                // Optionally validate token with backend
                try {
                    // You could add a /auth/me endpoint to validate
                    setState({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch {
                    // Token invalid, clear storage
                    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
                    storage.remove(STORAGE_KEYS.USER);
                    setState({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            } else {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

            storage.set(STORAGE_KEYS.AUTH_TOKEN, response.token);
            storage.set(STORAGE_KEYS.USER, response.user);

            setState({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });

            // Navigate to role-specific dashboard
            const homePath = roleHomePaths[response.user.role] || ROUTES.HOME;
            navigate(homePath);
        } catch (error) {
            setState((prev) => ({ ...prev, isLoading: false }));
            throw error;
        }
    }, [navigate]);

    const register = useCallback(async (data: RegisterData) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            const response = await apiClient.post<AuthResponse>('/auth/register', data);

            storage.set(STORAGE_KEYS.AUTH_TOKEN, response.token);
            storage.set(STORAGE_KEYS.USER, response.user);

            setState({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });

            // Navigate to role-specific onboarding or dashboard
            if (data.role === 'driver') {
                navigate(ROUTES.DRIVER.ONBOARDING);
            } else if (data.role === 'cab_owner') {
                navigate(ROUTES.OWNER.CABS_REGISTER);
            } else {
                // For customer and trip_planner, navigate to their dashboard
                const homePath = roleHomePaths[data.role] || ROUTES.HOME;
                navigate(homePath);
            }
        } catch (error) {
            setState((prev) => ({ ...prev, isLoading: false }));
            throw error;
        }
    }, [navigate]);

    const logout = useCallback(() => {
        storage.remove(STORAGE_KEYS.AUTH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);

        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
        });

        navigate(ROUTES.LOGIN);
    }, [navigate]);

    const updateUser = useCallback((updates: Partial<User>) => {
        setState((prev) => {
            if (!prev.user) return prev;

            const updatedUser = { ...prev.user, ...updates };
            storage.set(STORAGE_KEYS.USER, updatedUser);

            return { ...prev, user: updatedUser };
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Hook to get user role
export function useUserRole(): UserRole | null {
    const { user } = useAuth();
    return user?.role || null;
}

// Hook to check if user has specific role
export function useHasRole(roles: UserRole | UserRole[]): boolean {
    const role = useUserRole();
    if (!role) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(role);
}
