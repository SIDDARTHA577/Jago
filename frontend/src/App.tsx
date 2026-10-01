import React, { useEffect, useState } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Profile, UserRole } from './types';
import { authService } from './services/authService';
import { AppShell } from './components/layout/AppShell';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function AppContent() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(profile => {
        setUser(profile);
      })
      .finally(() => setLoading(false));

    // Periodic 5-second session check to enforce 15-minute expiration limit
    const interval = setInterval(() => {
      if (!authService.isSessionValid()) {
        setUser(prev => {
          if (prev) {
            authService.logout();
            navigate('/login');
          }
          return null;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLoginSuccess = (loggedInUser: Profile) => {
    setUser(loggedInUser);
    const targetPath =
      loggedInUser.role_key === 'pilot'
        ? '/pilot/dashboard'
        : loggedInUser.role_key === 'verifier'
        ? '/verifier/dashboard'
        : '/admin/dashboard';
    navigate(targetPath);
  };

  const handleSwitchRole = async (role: UserRole) => {
    const switched = await authService.switchRole(role);
    setUser(switched);
    const targetPath =
      switched.role_key === 'pilot'
        ? '/pilot/dashboard'
        : switched.role_key === 'verifier'
        ? '/verifier/dashboard'
        : '/admin/dashboard';
    navigate(targetPath);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 text-xs font-mono gap-2">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Initializing Jago Platform Client...</span>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login';

  return (
    <>
      {isAuthPage || !user ? (
        <AppRoutes
          user={user}
          onLoginSuccess={handleLoginSuccess}
          onProfileUpdated={setUser}
        />
      ) : (
        <AppShell
          user={user}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        >
          <AppRoutes
            user={user}
            onLoginSuccess={handleLoginSuccess}
            onProfileUpdated={setUser}
          />
        </AppShell>
      )}
    </>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
