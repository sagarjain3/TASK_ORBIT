import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Orbit, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen auth-bg p-6">
      {/* Dynamic Background Elements */}
      <div className="auth-mesh-gradient"></div>
      <div className="auth-orb w-[500px] h-[500px] bg-indigo-600/20 top-[-100px] right-[-100px] animate-float-orb"></div>
      <div className="auth-orb w-[400px] h-[400px] bg-violet-600/20 bottom-[-50px] left-[-50px] animate-float-orb" style={{ animationDirection: 'reverse' }}></div>

      <div className="w-full max-w-md animate-fade-in-scale relative z-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/40 animate-float-orb">
            <Orbit className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Welcome Back</h1>
          <p className="text-slate-400 font-medium">Elevate your productivity with TaskOrbit</p>
        </div>

        <div className="glass-card-dark p-10 rounded-[32px] shadow-2xl border border-white/10">
          {apiError && (
            <div className="p-4 mb-6 text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-shake">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
              />
            </div>

            <div className="flex items-center justify-end py-1">
              <Link to="#" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-lg btn-glow"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 font-medium">
              New to TaskOrbit?{' '}
              <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors ml-1 underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">
          © 2026 TaskOrbit. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
