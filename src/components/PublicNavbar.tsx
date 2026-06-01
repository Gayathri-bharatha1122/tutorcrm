import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Screen } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface PublicNavbarProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  isLoggedIn?: boolean;
  activeRole?: Role;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ screen, onNavigate, isLoggedIn, activeRole }) => {
  const { t } = useLanguage();

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (screen !== 'landing') {
      e.preventDefault();
      onNavigate('landing');
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent block leading-none mb-1">
              EduManage
            </span>
            <span className="text-xs block text-slate-500 font-medium leading-none">{t('Academic CRM')}</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a 
            href="#features" 
            onClick={(e) => handleNavLinkClick(e, 'features')}
            className="hover:text-slate-100 transition-colors"
          >
            {t('Features')}
          </a>
          <a 
            href="#courses" 
            onClick={(e) => handleNavLinkClick(e, 'courses')}
            className="hover:text-slate-100 transition-colors"
          >
            {t('Courses')}
          </a>
          <a 
            href="#ecosystem" 
            onClick={(e) => handleNavLinkClick(e, 'ecosystem')}
            className="hover:text-slate-100 transition-colors"
          >
            {t('Portals')}
          </a>
          <a 
            href="#stats" 
            onClick={(e) => handleNavLinkClick(e, 'stats')}
            className="hover:text-slate-100 transition-colors"
          >
            {t('Metrics')}
          </a>
        </nav>

        {/* Language & Auth Actions */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          {!isLoggedIn ? (
            <>
              <button 
                onClick={() => onNavigate('login')}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  screen === 'login' 
                    ? 'text-indigo-400' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t('Sign In')}
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-all cursor-pointer ${
                  screen === 'register'
                    ? 'bg-indigo-700 text-white shadow-indigo-700/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {t('Get Started')}
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                if (activeRole) {
                  onNavigate(activeRole);
                }
              }}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {t('Go to Dashboard')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
