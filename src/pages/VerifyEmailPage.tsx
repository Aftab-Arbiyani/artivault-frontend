import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

const RESEND_COOLDOWN = 60;
const REDIRECT_DELAY = 3000;

// ── Callback view (user clicked the link from email) ─────────────────────────

type CallbackStatus = 'loading' | 'success' | 'error';

const VerificationCallback = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const { isAuthenticated, updateUser } = useAuth();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    authService
      .verifyEmail(token)
      .then(async () => {
        setStatus('success');
        if (isAuthenticated) {
          const updatedUser = await authService.getMe();
          updateUser(updatedUser);
          setTimeout(() => navigate('/'), REDIRECT_DELAY);
        } else {
          setTimeout(() => navigate('/login'), REDIRECT_DELAY);
        }
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err?.message || 'Verification failed. The link may have expired.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          {status === 'loading' && (
            <>
              <div className="flex justify-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Verifying your email…
              </h1>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Email verified!
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Your account has been verified. Redirecting you…
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <XCircle className="w-16 h-16 text-destructive" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Verification failed
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">{errorMessage}</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Register Again
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 bg-secondary text-foreground rounded-lg font-medium text-sm hover:bg-secondary/80 transition-colors border border-border"
                >
                  Go to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Waiting view (shown right after registration) ─────────────────────────────

const VerificationWaiting = ({ email }: { email: string }) => {
  const navigate = useNavigate();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendVerificationEmail(email);
      toast.success('Verification email sent!');
      setResendCooldown(RESEND_COOLDOWN);
    } catch {
      toast.error('Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Check your email</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              We sent a verification link to{' '}
              <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>

          <p className="text-muted-foreground text-sm">
            Click the link in your email to verify your account. Once verified, you can sign in.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={resending || resendCooldown > 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
            </button>

            <button
              onClick={() => navigate('/register')}
              className="w-full py-2.5 bg-secondary text-foreground rounded-lg font-medium text-sm hover:bg-secondary/80 transition-colors border border-border"
            >
              Use a Different Email
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Already verified?{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Route component ───────────────────────────────────────────────────────────

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = (location.state as { email?: string } | null)?.email;

  // Token in URL → user clicked the email link
  if (token) {
    return <VerificationCallback token={token} />;
  }

  // Email in state → just registered
  if (email) {
    return <VerificationWaiting email={email} />;
  }

  // Neither → send them back to register
  navigate('/register', { replace: true });
  return null;
};

export default VerifyEmailPage;
