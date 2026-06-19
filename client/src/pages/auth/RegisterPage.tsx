import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthField from '../../components/auth/AuthField';
import AuthAlert from '../../components/auth/AuthAlert';
import { register as registerRequest } from '../../services/authService';
import { loginSuccess } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { getAuthErrorMessage, getRoleHomePath } from './authUtils';

const MIN_PASSWORD_LENGTH = 8;

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = 'Full name is required.';
    }

    if (!trimmedEmail) {
      errors.email = 'Email is required.';
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await registerRequest({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      const { user: authUser, token: authToken } = response.data;
      dispatch(loginSuccess({ user: authUser, token: authToken }));
    } catch (err) {
      setError(getAuthErrorMessage(err));
      console.error('[Register Error]', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (token && user) {
    return <Navigate replace to={getRoleHomePath(user.role)} />;
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join as a candidate to upload your resume, take assessments, and complete AI interviews."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-100 transition hover:text-white">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-5" noValidate>
        <AuthField
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex Morgan"
          error={fieldErrors.name}
          required
          disabled={isSubmitting}
        />

        <AuthField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          error={fieldErrors.email}
          required
          disabled={isSubmitting}
        />

        <AuthField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          error={fieldErrors.password}
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

        <AuthField
          label="Confirm password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          error={fieldErrors.confirmPassword}
          required
          disabled={isSubmitting}
        />

        {error && <AuthAlert type="error" message={error} />}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
