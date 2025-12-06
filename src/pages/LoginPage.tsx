import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';
import { showError } from '@/utils/toast';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      showError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm bg-card/80 backdrop-blur-lg border border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-slate-100">SmartFan Login</CardTitle>
          <CardDescription className="text-slate-400 pt-2">Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="kelompok4"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="kelompok4"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-[0_0_15px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.7)]"
            >
              Connect to System
            </Button>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <Link to="/register" className="underline text-primary hover:text-primary/80">
                Daftar di sini
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;