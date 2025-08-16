import React, { useState } from 'react';
import { X, User, Camera, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const ProfileModal = ({ user, isOpen, onClose, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    language: user?.profile?.language || 'es',
    country: user?.profile?.country || 'ES'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        onUpdateProfile(data);
        onClose();
      } else {
        alert(data.detail || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAvatar = () => {
    const randomId = Math.floor(Math.random() * 70) + 1;
    const newAvatar = `https://i.pravatar.cc/150?img=${randomId}`;
    setFormData(prev => ({ ...prev, avatar: newAvatar }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl font-semibold">
                Editar Perfil
              </CardTitle>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="bg-red-600 text-white text-2xl">
                    {formData.name.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  onClick={generateAvatar}
                  size="icon"
                  className="absolute -bottom-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full w-8 h-8"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 text-sm text-center">
                Cambiar foto de perfil
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label className="text-white">Idioma</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange('language', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="es" className="text-white">Español</SelectItem>
                    <SelectItem value="en" className="text-white">English</SelectItem>
                    <SelectItem value="fr" className="text-white">Français</SelectItem>
                    <SelectItem value="pt" className="text-white">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label className="text-white">País</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="ES" className="text-white">España</SelectItem>
                    <SelectItem value="MX" className="text-white">México</SelectItem>
                    <SelectItem value="AR" className="text-white">Argentina</SelectItem>
                    <SelectItem value="CO" className="text-white">Colombia</SelectItem>
                    <SelectItem value="US" className="text-white">Estados Unidos</SelectItem>
                    <SelectItem value="GB" className="text-white">Reino Unido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subscription Info */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Estado de Suscripción</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tipo:</span>
                    <span className={`font-medium ${
                      user?.subscription?.type === 'free_trial' 
                        ? 'text-yellow-400' 
                        : 'text-green-400'
                    }`}>
                      {user?.subscription?.type === 'free_trial' ? 'Prueba Gratuita' : 'Gratis con Anuncios'}
                    </span>
                  </div>
                  {user?.subscription?.type === 'free_trial' && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Días restantes:</span>
                      <span className="text-yellow-400 font-medium">
                        {user.subscription.days_remaining}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-300">Películas en Mi Lista:</span>
                    <span className="text-white font-medium">
                      {user?.my_list?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-auto font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Guardando...'
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileModal;