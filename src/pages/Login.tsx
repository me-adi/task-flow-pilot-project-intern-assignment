import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/lib/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Task Flow</h1>
          <p className="text-muted-foreground mt-2">Manage your tasks efficiently</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login; 