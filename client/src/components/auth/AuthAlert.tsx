import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface AuthAlertProps {
  type: 'success' | 'error';
  message: string;
}

const styles = {
  success: {
    container: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    icon: 'text-emerald-400',
  },
  error: {
    container: 'border-red-500/20 bg-red-500/10 text-red-200',
    icon: 'text-red-400',
  },
};

const AuthAlert = ({ type, message }: AuthAlertProps) => {
  const style = styles[type];
  const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${style.container}`} role="alert">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />
      <p>{message}</p>
    </div>
  );
};

export default AuthAlert;
