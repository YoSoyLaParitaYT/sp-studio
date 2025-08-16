import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Header = ({ user, onSearch, onProfileClick, onSignOut }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold">PARIFLIX</h1>
          
          {/* Navigation Menu - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Inicio</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Series</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Películas</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Novedades</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Mi lista</a>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {searchVisible ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Títulos, personas, géneros"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-black/70 border-white/20 text-white placeholder:text-gray-400"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setSearchVisible(false);
                  }}
                />
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchVisible(true)}
                className="text-white hover:bg-white/10"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-red-600 text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 border-gray-700">
              <DropdownMenuItem onClick={onProfileClick} className="text-white hover:bg-white/10">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10">
                Cuenta
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10">
                Centro de ayuda
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignOut} className="text-white hover:bg-white/10">
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Trial Info */}
          {user?.subscription?.type === 'free_trial' && (
            <div className="hidden md:block bg-yellow-600 text-black px-3 py-1 rounded text-sm font-medium">
              Prueba: {user.subscription.daysRemaining} días restantes
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;