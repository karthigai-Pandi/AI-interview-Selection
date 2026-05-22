import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
  children?: ReactNode;
}

const variants = {
  primary: 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-600 hover:shadow-primary/30',
  secondary: 'bg-surface/80 backdrop-blur-md text-white border border-primary/8 hover:bg-surface/90 hover:border-primary/12',
  ghost: 'bg-transparent text-accent hover:bg-white/3 hover:text-white',
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
