type AuthUser = { id: string; name: string; role: 'candidate' | 'admin' | 'hr' };

export const getRoleHomePath = (role: AuthUser['role']) => {
  if (role === 'admin' || role === 'hr') return '/admin';
  return '/candidate';
};

export const getAuthErrorMessage = (err: unknown): string => {
  const error = err as {
    isNetworkError?: boolean;
    code?: string;
    message?: string;
    response?: { data?: { message?: string } };
  };

  if (error?.isNetworkError || error?.message?.includes('Unable to connect') || error?.code === 'ERR_NETWORK') {
    return (
      'Unable to connect to the server. Check your internet connection and ensure the backend is running. ' +
      'For deployed apps, verify VITE_API_URL is set correctly.'
    );
  }

  if (error?.message?.includes('timeout')) {
    return 'The server took too long to respond. Please try again in a moment.';
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return error?.message || 'Something went wrong. Please try again.';
};
