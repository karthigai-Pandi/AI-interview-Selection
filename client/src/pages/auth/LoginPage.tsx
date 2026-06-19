import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthField from '../../components/auth/AuthField';
import AuthAlert from '../../components/auth/AuthAlert';
import { login as loginRequest } from '../../services/authService';
import { loginSuccess } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { getAuthErrorMessage, getRoleHomePath } from './authUtils';

const REMEMBER_EMAIL_KEY = 'ais_remember_email';

const LoginPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const locationState = location.state as { message?: string; email?: string } | null;

  const [email, setEmail] = useState(() => {
    if (locationState?.email) return locationState.email;
    if (import.meta.env.DEV) return 'candidate@example.com';
    const remembered = localStorage.getItem(REMEMBER_EMAIL_KEY);
    return remembered || '';
  });
  const [password, setPassword] = useState(import.meta.env.DEV ? 'password123' : '');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem(REMEMBER_EMAIL_KEY));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(locationState?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (locationState?.message) {
      setSuccessMessage(locationState.message);
      window.history.replaceState({}, document.title);
    }
    if (locationState?.email) {
      setEmail(locationState.email);
    }
  }, [locationState?.email, locationState?.message]);

  useEffect(() => {
    const onUnauthorized = () => setError('Your session expired. Please sign in again.');
    window.addEventListener('ais:auth:unauthorized', onUnauthorized as EventListener);
    return () => window.removeEventListener('ais:auth:unauthorized', onUnauthorized as EventListener);
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await loginRequest({ email: email.trim(), password });
      const { user: authUser, token: authToken } = response.data;
      dispatch(loginSuccess({ user: authUser, token: authToken }));

      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
      console.error('[Login Error]', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (token && user) {
    return <Navigate replace to={getRoleHomePath(user.role)} />;
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your dashboard and continue your hiring workflow."
      footer={
        <>
          New to AIVentures?{' '}
          <Link to="/register" className="font-medium text-primary-100 transition hover:text-white">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5" noValidate>
        <AuthField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          disabled={isSubmitting}
        />

        <AuthField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={isSubmitting}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-white/10 bg-slate-900 text-primary focus:ring-primary/30"
              disabled={isSubmitting}
            />
            Remember email
          </label>
          <span className="text-slate-500">Forgot password? Contact support.</span>
        </div>

        {successMessage && <AuthAlert type="success" message={successMessage} />}
        {error && <AuthAlert type="error" message={error} />}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
