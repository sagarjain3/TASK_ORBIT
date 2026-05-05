import React from 'react';
import Loader from './Loader';

const Button = ({ children, onClick, type = 'button', variant = 'primary', isLoading = false, disabled = false, className = '', ...props }) => {
  const baseClasses = 'px-5 py-2.5 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 relative overflow-hidden interactive-scale';
  
  const variants = {
    primary: `bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 focus:ring-indigo-500/30 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed grayscale-[0.2] shadow-none' : ''}`,
    secondary: `bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 focus:ring-slate-100 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`,
    danger: `bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_4px_15px_rgba(244,63,94,0.3)] hover:shadow-[0_8px_25px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 focus:ring-red-500/30 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed grayscale-[0.2] shadow-none' : ''}`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader size="sm" color={variant === 'secondary' ? 'text-indigo-600' : 'text-white'} />
          <span className="opacity-90">Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
