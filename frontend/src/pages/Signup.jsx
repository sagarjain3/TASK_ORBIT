import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Orbit, ArrowRight, Users, BarChart3, Zap, CheckCircle2 } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;

    setIsLoading(true);
    try {
      await api.post('/auth/signup', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        setApiError(err.response.data.errors[0].msg);
      } else {
        setApiError(err.response?.data?.message || 'Failed to sign up');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen auth-bg p-6 lg:p-12 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="auth-mesh-gradient"></div>
      <div className="auth-orb w-[600px] h-[600px] bg-indigo-600/15 top-[-150px] left-[-150px] animate-float-orb"></div>
      <div className="auth-orb w-[500px] h-[500px] bg-violet-600/15 bottom-[-100px] right-[-100px] animate-float-orb" style={{ animationDirection: 'reverse' }}></div>

      <div className="w-full max-w-5xl animate-fade-in-scale relative z-10 flex flex-col lg:flex-row gap-12 items-center">
        {/* Left Side: Branding/Value Prop */}
        <div className="hidden lg:flex flex-col lg:w-5/12 text-white p-4">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <Orbit className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-6xl font-black tracking-tight leading-[1.1] mb-8">
            Join the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">future of work.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium">
            Streamline your projects and empower your team with the most intuitive management platform.
          </p>
          
          <div className="space-y-6">
            {[
              'Advanced Kanban Boards',
              'Real-time Collaboration',
              'Powerful Data Analytics'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300 font-bold text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="w-full lg:w-7/12">
          <div className="glass-card-dark p-8 md:p-12 rounded-[40px] shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-white mb-3">Get Started</h2>
              <p className="text-slate-400 font-bold text-lg">Create your free account today</p>
            </div>

            {apiError && (
              <div className="p-4 mb-8 text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-shake">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 mb-0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 mb-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 mb-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 mb-0"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-5 text-xl font-black btn-glow mt-4 rounded-2xl"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center lg:text-left">
              <p className="text-slate-400 font-bold text-lg">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-all ml-1 border-b-2 border-indigo-400/30 hover:border-indigo-400">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
