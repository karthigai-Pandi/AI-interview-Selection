import { InputHTMLAttributes, ReactNode } from 'react';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  trailing?: ReactNode;
}

const AuthField = ({ label, error, trailing, id, className = '', ...props }: AuthFieldProps) => {
  const fieldId = id || props.name;

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          className={`w-full rounded-2xl border bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            error ? 'border-red-500/50' : 'border-white/10'
          } ${trailing ? 'pr-12' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{trailing}</div>}
      </div>
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthField;
