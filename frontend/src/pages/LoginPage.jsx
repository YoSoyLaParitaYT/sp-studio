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
    
    // Simulate login
    setTimeout(() => {
      onLogin({
        email,
        password,
        rememberMe
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleDiscordLogin = () => {
    console.log('Discord login clicked');
    // TODO: Implement Discord OAuth
    onLogin({ provider: 'discord' });
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
            {/* Discord Login */}
            <Button
              onClick={handleDiscordLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 h-auto font-medium flex items-center justify-center gap-3 transition-all duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Continuar con Discord
            </Button>

            <div className="relative">
              <Separator className="bg-gray-600" />
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black text-gray-400 text-sm px-4 mx-auto w-fit">
                o
              </span>
            </div>

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