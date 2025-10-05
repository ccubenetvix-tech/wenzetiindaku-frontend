import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { updateUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const isNewUser = searchParams.get('isNewUser') === 'true';
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          toast({
            title: "Authentication Failed",
            description: "There was an error during Google authentication.",
            variant: "destructive",
          });
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('No authentication token received.');
          toast({
            title: "Authentication Failed",
            description: "No authentication token received.",
            variant: "destructive",
          });
          return;
        }

        // Store the token
        localStorage.setItem('auth_token', token);
        
        // Decode the token to get user info (basic decode, not verification)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Fetch complete user data from backend
          const response = await fetch(`${import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'https://wenzetiindaku-backend.onrender.com/api')}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            const user = userData.data.user;
            
            // Update auth context with complete user data
            updateUser(user);
            
            setStatus('success');
            setMessage(isNewUser ? 'Welcome to WENZE TII NDAKU! Your account has been created successfully.' : 'Welcome back! You have been logged in successfully.');
            
            toast({
              title: "Authentication Successful",
              description: isNewUser ? "Welcome to WENZE TII NDAKU!" : "Welcome back!",
            });

            // Redirect to profile update page for new users, home for existing users
            setTimeout(() => {
              if (isNewUser) {
                navigate('/update-profile');
              } else {
                navigate('/');
              }
            }, 2000);
          } else {
            throw new Error('Failed to fetch user data');
          }

        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          setStatus('error');
          setMessage('Invalid authentication token.');
        }

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication.');
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  const handleRetry = () => {
    navigate('/customer/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              {status === 'loading' && (
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Authentication Successful'}
              {status === 'error' && 'Authentication Failed'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {status === 'loading' && 'Please wait while we complete your authentication.'}
              {status === 'success' && 'You will be redirected shortly.'}
              {status === 'error' && 'There was a problem with your authentication.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {message && (
              <Alert className={`mb-6 ${status === 'error' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'}`}>
                <AlertDescription className={status === 'error' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'success' && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Redirecting you to the homepage...
                </p>
                <Button onClick={handleGoHome} className="w-full">
                  Go to Homepage
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Please try logging in again or contact support if the problem persists.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRetry} className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={handleGoHome} className="flex-1">
                    Go Home
                  </Button>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Please wait while we process your authentication...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2025 WENZE TII NDAKU. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
