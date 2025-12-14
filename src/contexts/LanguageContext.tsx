import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  translations: Record<string, string>;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Load translations for current language
  const loadTranslations = async (language: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('website_translations_2025_12_11_15_30')
        .select('translation_key, translation_value')
        .eq('language_code', language);

      if (error) throw error;

      const translationMap: Record<string, string> = {};
      data?.forEach((item) => {
        translationMap[item.translation_key] = item.translation_value;
      });

      setTranslations(translationMap);
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize language from localStorage or default to 'en'
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    setCurrentLanguage(savedLanguage);
    loadTranslations(savedLanguage);
  }, []);

  // Set language and save to localStorage
  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
    loadTranslations(lang);
  };

  // Translation function
  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    translations,
    loading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;