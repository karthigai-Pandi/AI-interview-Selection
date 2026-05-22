import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
  children?: ReactNode;
}

const variants = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:from-indigo-400 hover:to-purple-400',
  secondary: 'bg-slate-800/80 backdrop-blur-md text-slate-100 border border-white/10 hover:bg-slate-700/80 hover:border-white/20',
  ghost: 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
};

const Button = ({ variant = 'primary', icon, children, ...props }: ButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]}`}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
};

export default Button;
