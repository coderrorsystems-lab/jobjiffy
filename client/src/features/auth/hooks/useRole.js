import { useAuth } from './useAuth';

export function useRole() {
  const { user } = useAuth();
  
  return {
    role: user?.role || null,
    isUser: user?.role === 'user',
    isProfessional: user?.role === 'professional',
    isAdmin: user?.role === 'admin',
  };
}
