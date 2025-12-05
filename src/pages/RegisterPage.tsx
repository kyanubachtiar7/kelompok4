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
      <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm border border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Daftar Akun</CardTitle>
          <CardDescription>Buat akun baru untuk mengakses dasbor.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nama Pengguna</Label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleRegister} className="w-full">
              Daftar
            </Button>
            <div className="mt-4 text-center text-sm">
              Sudah punya akun?{' '}
              <Link to="/login" className="underline text-primary">
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