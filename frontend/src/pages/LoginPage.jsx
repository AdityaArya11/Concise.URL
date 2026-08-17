import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { Label, Input, FieldError } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.ok) {
      toast('Welcome back!', 'success');
      const redirect = new URLSearchParams(location.search).get('redirect') || '/dashboard';
      navigate(redirect);
    } else {
      setError(result.error);
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back to Concise."
      footer={<>Don't have an account? <Link to="/register" className="text-accent-600 font-medium">Sign up</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <FieldError>{error}</FieldError>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="text-caption text-gray-400 mt-5 text-center">
        Demo tip: register a new account — no email verification required.
      </p>
    </AuthLayout>
  );
}
