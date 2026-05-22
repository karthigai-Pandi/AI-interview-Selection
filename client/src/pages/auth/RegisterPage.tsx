import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { register as registerRequest } from '../../services/authService';
import { loginStart, loginSuccess } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (token && user) {
    return <Navigate replace to={user.role === 'admin' ? '/admin' : '/candidate'} />;
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    dispatch(loginStart());

    try {
      const response = await registerRequest({ name, email, password });
      const { user, token } = response.data;
      dispatch(loginSuccess({ user, token }));
      navigate(user.role === 'admin' ? '/admin' : '/candidate/resume');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Registration failed. Please try again.');
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
          <Button type="submit">Create account</Button>
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
