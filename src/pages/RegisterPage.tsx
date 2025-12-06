import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '@/utils/toast';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = () => {
    if (!username || !password) {
      showError('Nama pengguna dan kata sandi tidak boleh kosong.');
      return;
    }
    const success = register(username, password);
    if (success) {
      showSuccess('Pendaftaran berhasil! Silakan masuk.');
      navigate('/login');
    } else {
      showError('Nama pengguna sudah digunakan.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm bg-card/80 backdrop-blur-lg border border-primary/20 shadow-2xl shadow-primary/10 animate-fade-in animate-glow transition-transform duration-300 hover:scale-[1.02]">
        <CardHeader className="text-center">
          <CardTitle 
            className="text-3xl font-bold text-slate-100 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Daftar Akun
          </CardTitle>
          <CardDescription 
            className="text-slate-400 pt-2 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Buat akun baru untuk mengakses dasbor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div 
              className="grid gap-2 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.6s' }}
            >
              <Label htmlFor="username">Nama Pengguna</Label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary/50"
              />
            </div>
            <div 
              className="grid gap-2 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.8s' }}
            >
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50"
              />
            </div>
            <Button 
              onClick={handleRegister} 
              className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-[0_0_15px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.7)] opacity-0 animate-fade-in"
              style={{ animationDelay: '1.0s' }}
            >
              Daftar
            </Button>
            <div 
              className="mt-4 text-center text-sm text-muted-foreground opacity-0 animate-fade-in"
              style={{ animationDelay: '1.2s' }}
            >
              Sudah punya akun?{' '}
              <Link to="/login" className="underline text-primary hover:text-primary/80">
                Masuk
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;