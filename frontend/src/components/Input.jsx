import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', id, value, onChange, placeholder, error, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col group ${className.includes('mb-') ? '' : 'mb-5'}`}>
      {label && (
        <label htmlFor={id} className="mb-2 text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-indigo-600">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 text-slate-800 bg-white border rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
            error 
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' 
              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 hover:border-slate-300'
          } ${isPassword ? 'pr-12' : ''} placeholder:text-slate-400 text-[15px] ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <span className="mt-2 text-xs font-semibold text-rose-500 animate-slide-down">{error}</span>}
    </div>
  );
};

export default Input;
