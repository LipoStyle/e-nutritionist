import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg font-medium">Checking permissions...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <Alert variant="destructive">
            <AlertTitle>Access denied</AlertTitle>
            <AlertDescription>
              You are signed in but do not have administrator permissions. Please contact support if you believe this is an error.
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
