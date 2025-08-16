import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';

const LoginPage = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        onLogin(data.user);
      } else {
        alert(data.detail || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    // Removed Discord login functionality
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-gray-900/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg)',
            filter: 'blur(8px)'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-red-600 text-4xl md:text-5xl font-bold mb-2">PARIFLIX</h1>
          <p className="text-white/80 text-lg">Tu entretenimiento, sin límites</p>
        </div>

        {/* Login Card */}
        <Card className="bg-black/80 backdrop-blur-md border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-2xl font-semibold text-center">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">


            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email o número de teléfono
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 h-12"
                  placeholder="Ingresa tu email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 h-12 pr-10"
                    placeholder="Tu contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-12 text-gray-400 hover:text-white hover:bg-transparent"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-red-600 focus:ring-red-500"
                  />
                  <Label htmlFor="remember" className="text-gray-300 text-sm">
                    Recuérdame
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-gray-300 hover:text-white text-sm p-0 h-auto"
                >
                  ¿Necesitas ayuda?
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-auto font-medium transition-colors duration-200"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="text-center">
              <span className="text-gray-400">¿Primera vez en PariFlix? </span>
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToSignup}
                className="text-white hover:underline p-0 h-auto font-medium"
              >
                Suscríbete ahora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trial Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            <span className="text-yellow-400 font-semibold">30 días gratis</span>
            {' '}• Cancela cuando quieras • Sin compromisos
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;