import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const Card = ({ title, description, children, className = '' }: CardProps) => {
  return (
    <section className={`rounded-3xl border border-white/6 bg-surface/80 p-6 shadow-soft-lg ${className}`}>
      {(title || description) && (
        <div className="mb-5">
          {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
          {description && <p className="mt-2 text-sm text-slate-300">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
};

export default Card;
