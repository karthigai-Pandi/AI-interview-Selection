import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { login as loginRequest } from '../../services/authService';
import { loginStart, loginSuccess } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const workflow = useSelector((state: RootState) => state.workflow);
  const [email, setEmail] = useState(import.meta.env.DEV ? 'candidate@example.com' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? 'password123' : '');
  const [error, setError] = useState('');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    dispatch(loginStart());

    try {
      const response = await loginRequest({ email, password });
      const { user, token } = response.data;
      dispatch(loginSuccess({ user, token }));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed. Please try again.');
    }
  };

  // listen for global unauthorized event (clears token on 401)
  useEffect(() => {
    const onUnauthorized = () => setError('Session expired. Please sign in again.');
    window.addEventListener('ais:auth:unauthorized', onUnauthorized as EventListener);
    return () => window.removeEventListener('ais:auth:unauthorized', onUnauthorized as EventListener);
  }, []);

  if (token && user) {
    if (user.role === 'admin') {
      return <Navigate replace to="/admin" />;
    }
    return <Navigate replace to={`/candidate/${workflow.currentStep}`} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mx-auto max-w-xl">
      <Card title="Welcome back" description="Secure login for talent teams and candidates.">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="rounded border-white/10 bg-slate-900 text-indigo-500" />
              Remember me
            </label>
            <Link to="/" className="text-indigo-300 hover:text-indigo-200">Forgot password?</Link>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit">Sign in</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New to AIVentures?{' '}
          <Link to="/register" className="text-indigo-300 hover:text-indigo-200">
            Create account
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};

export default LoginPage;
