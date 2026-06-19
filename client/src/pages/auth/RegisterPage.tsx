import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { register as registerRequest } from '../../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, loading } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (token && user) {
    return <Navigate replace to={user.role === 'admin' ? '/admin' : '/candidate'} />;
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    dispatch(loginStart());

    try {
      await registerRequest({ name, email, password });
      dispatch(loginFailure());
      setSuccess('Account created successfully! Redirecting to sign in page...');
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Account created successfully! Please sign in with your credentials.' },
        });
      }, 2000);
    } catch (err: any) {
      dispatch(loginFailure());
      
      // Network/connection errors
      if ((err as any).isNetworkError || err?.message?.includes('Unable to connect') || err?.code === 'ERR_NETWORK') {
        setError(
          'Network Error: Unable to connect to the backend server. ' +
          'If this is a deployed application, make sure the VITE_API_URL environment variable is configured in Vercel settings and your backend server is online. ' +
          `(${err?.message})`
        );
      }
      // Timeout errors
      else if (err?.message?.includes('timeout')) {
        setError(`Server timeout: ${err?.message}. Please check if your backend is running.`);
      }
      // API validation/auth errors
      else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      }
      // Generic fallback
      else {
        setError(err?.message || 'Registration failed. Please try again.');
      }
      
      // Always log full error for debugging
      console.error('[Register Error]', err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mx-auto max-w-xl">
      <Card title="Create your account" description="Join the AI hiring platform for candidates and recruiting teams.">
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Company email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@company.com"
              className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}
          <Button type="submit" disabled={!!success || loading}>
            {success ? 'Redirecting...' : loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-300 hover:text-indigo-200">
            Sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};

export default RegisterPage;
