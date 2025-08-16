import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';

const SignupPage = ({ onSignup, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
  };

  const handleNextStep = () => {
    if (step === 1 && validateEmail(formData.email)) {
      setStep(2);
    } else if (step === 2) {
      const passwordValidation = validatePassword(formData.password);
      if (Object.values(passwordValidation).every(Boolean) && 
          formData.password === formData.confirmPassword) {
        setStep(3);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        onSignup(data.user);
      } else {
        alert(data.detail || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);
  const progressValue = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-purple-900/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg)',
            filter: 'blur(10px)'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-red-600 text-4xl md:text-5xl font-bold mb-2">PARIFLIX</h1>
          <p className="text-white/80 text-lg">Únete a millones de usuarios</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Paso {step} de 3</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2 bg-gray-700" />
        </div>

        {/* Signup Card */}
        <Card className="bg-black/80 backdrop-blur-md border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-2xl font-semibold text-center">
              {step === 1 && 'Crear Cuenta'}
              {step === 2 && 'Configura tu Contraseña'}
              {step === 3 && 'Información Personal'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Email */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Dirección de email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 h-12"
                    placeholder="ejemplo@email.com"
                    required
                  />
                  {formData.email && !validateEmail(formData.email) && (
                    <p className="text-red-400 text-sm">Ingresa un email válido</p>
                  )}
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <h3 className="text-white font-medium">✨ Con PariFlix obtienes:</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• 30 días de prueba gratis</li>
                    <li>• Miles de películas y series</li>
                    <li>• Contenido en 4K Ultra HD</li>
                    <li>• Sin compromisos, cancela cuando quieras</li>
                  </ul>
                </div>

                <Button
                  onClick={handleNextStep}
                  disabled={!validateEmail(formData.email)}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 h-auto font-medium"
                >
                  Continuar
                </Button>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 h-12 pr-10"
                      placeholder="Crea una contraseña segura"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 h-12 pr-10"
                      placeholder="Confirma tu contraseña"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-0 h-12 text-gray-400 hover:text-white hover:bg-transparent"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Requisitos de contraseña:</h3>
                  <div className="space-y-1 text-sm">
                    <div className={`flex items-center gap-2 ${passwordValidation.length ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordValidation.length ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      Mínimo 8 caracteres
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordValidation.uppercase ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      Una letra mayúscula
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordValidation.lowercase ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      Una letra minúscula
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.number ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordValidation.number ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      Un número
                    </div>
                    <div className={`flex items-center gap-2 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.password === formData.confirmPassword && formData.confirmPassword ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      Las contraseñas coinciden
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!Object.values(passwordValidation).every(Boolean) || 
                             formData.password !== formData.confirmPassword}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Personal Info */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 h-12"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
                  <h3 className="text-yellow-400 font-medium mb-2">🎉 ¡Bienvenido a PariFlix!</h3>
                  <p className="text-gray-300 text-sm">
                    Estás a punto de comenzar tu prueba gratuita de 30 días. 
                    Después de este período, podrás seguir disfrutando del contenido con anuncios.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 rounded border-gray-600 bg-gray-800 text-red-600 focus:ring-red-500"
                    />
                    <Label htmlFor="terms" className="text-gray-300 text-sm leading-relaxed">
                      Acepto los{' '}
                      <Button variant="link" className="text-red-400 hover:text-red-300 p-0 h-auto text-sm">
                        Términos de Uso
                      </Button>
                      {' '}y la{' '}
                      <Button variant="link" className="text-red-400 hover:text-red-300 p-0 h-auto text-sm">
                        Política de Privacidad
                      </Button>
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                  >
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.name || !formData.acceptTerms || isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 h-auto font-medium"
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </div>
              </form>
            )}

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-700">
              <span className="text-gray-400">¿Ya tienes una cuenta? </span>
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToLogin}
                className="text-white hover:underline p-0 h-auto font-medium"
              >
                Inicia sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;