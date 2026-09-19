import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getApiBaseUrl } from '@/utils/api';
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";

const API_BASE_URL = getApiBaseUrl();

const AuthCallback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { setSession, clearSession } = useAuth();
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
          setMessage(i18n.t('pages.authCallback.authenticationFailedPleaseTryAgain'));
          toast({
            title: i18n.t('pages.authCallback.authenticationFailed'),
            description: i18n.t('pages.authCallback.thereWasAnErrorDuringGoogle'),
            variant: "destructive",
          });
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage(i18n.t('pages.authCallback.noAuthenticationTokenReceived'));
          toast({
            title: i18n.t('pages.authCallback.authenticationFailed'),
            description: i18n.t('pages.authCallback.noAuthenticationTokenReceived'),
            variant: "destructive",
          });
          return;
        }

        const decodeJwtPayload = (jwtToken: string) => {
          const parts = jwtToken.split('.');
          if (parts.length !== 3) {
            throw new Error(i18n.t('pages.authCallback.invalidTokenFormat'));
          }

          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const padding = (4 - (base64.length % 4 || 4)) % 4;
          const paddedBase64 = base64.padEnd(base64.length + padding, '=');
          const decodedPayload = atob(paddedBase64);

          return JSON.parse(decodedPayload);
        };

        try {
          const payload = decodeJwtPayload(token);
          if (!payload?.userId || !payload?.role) {
            throw new Error(i18n.t('pages.authCallback.missingTokenClaims'));
          }
        } catch (decodeError) {
          console.error('Error decoding token payload:', decodeError);
          setStatus('error');
          setMessage(i18n.t('pages.authCallback.invalidAuthenticationToken'));
          clearSession();
          return;
        }

        // Fetch complete user data from backend
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const errorMessage = errorBody?.error?.message || 'Failed to validate authentication session.';
          throw new Error(errorMessage);
        }

        const userData = await response.json();
        const user = userData?.data?.user;

        if (!user) {
          throw new Error(i18n.t('pages.authCallback.userDataMissingInAuthenticationResponse'));
        }

        // Persist session
        setSession(token, user);

        setStatus('success');
        setMessage(isNewUser ? i18n.t('pages.authCallback.welcomeToWenzeTiiNdakuYour') : i18n.t('pages.authCallback.welcomeBackYouHaveBeenLogged'));

        toast({
          title: i18n.t('pages.authCallback.authenticationSuccessful'),
          description: isNewUser ? i18n.t('pages.authCallback.welcomeToWenzeTiiNdaku') : i18n.t('pages.authCallback.welcomeBack'),
        });

        // Redirect to profile update page for new users, home for existing users
        setTimeout(() => {
          if (isNewUser) {
            navigate('/update-profile');
          } else {
            navigate('/');
          }
        }, 2000);

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : i18n.t('pages.authCallback.anUnexpectedErrorOccurredDuringAuthentication'));
        clearSession();
        toast({
          title: i18n.t('pages.authCallback.authenticationError'),
          description: i18n.t('pages.authCallback.weCouldNotCompleteGoogleAuthentication'),
          variant: "destructive",
        });
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast, setSession, clearSession]);

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
              {status === 'loading' && t('pages.authCallback.authenticating')}
              {status === 'success' && t('pages.authCallback.authenticationSuccessful')}
              {status === 'error' && t('pages.authCallback.authenticationFailed')}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {status === 'loading' && t('pages.authCallback.pleaseWaitWhileWeCompleteYour')}
              {status === 'success' && t('pages.authCallback.youWillBeRedirectedShortly')}
              {status === 'error' && t('pages.authCallback.thereWasAProblemWithYour')}
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
                  {t('pages.authCallback.redirectingYouToTheHomepage')}
                </p>
                <Button onClick={handleGoHome} className="w-full">
                  {t('pages.authCallback.goToHomepage')}
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t('pages.authCallback.pleaseTryLoggingInAgainOr')}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRetry} className="flex-1">
                    {t('pages.authCallback.tryAgain')}
                  </Button>
                  <Button onClick={handleGoHome} className="flex-1">
                    {t('pages.authCallback.goHome')}
                  </Button>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t('pages.authCallback.pleaseWaitWhileWeProcessYour')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            {t('pages.authCallback.n2025WenzeTiiNdakuAllRights')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
