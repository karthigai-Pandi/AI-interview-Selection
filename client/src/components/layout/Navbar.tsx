import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Platform', href: '#features' },
  { label: 'Dashboard', href: '/candidate' },
  { label: 'Analytics', href: '/admin' },
  { label: 'Login', href: '/login' },
];

const Navbar = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-40 mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 rounded-full border border-white/10 bg-surface/80 px-6 py-4 backdrop-blur-xl"
    >
      <Link to="/" className="font-semibold text-slate-100">
        AIVentures
      </Link>
      <nav className="hidden items-center gap-8 lg:flex">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} className="text-sm text-slate-300 transition hover:text-slate-100">
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link to="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600">
          Get started
        </Link>
      </div>
    </motion.header>
  );
};

export default Navbar;
