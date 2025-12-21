import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, X, Sun, Moon, Globe, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const { currentLanguage, setLanguage, t } = useLanguage();
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "gr", name: "Ελληνικά", flag: "🇬🇷" },
  ];

  const navigation = [
    { name: t("nav.home", "Home"), href: "/" },
    { name: t("nav.services", "Services"), href: "/services" },
    { name: t("nav.blog", "Blog"), href: "/blogs" },
    { name: t("nav.recipes", "Recipes"), href: "/recipes" },
    { name: t("nav.about", "About"), href: "/about" },
    { name: t("nav.contact", "Contact"), href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b shadow-soft">
        {/* First Section: Utilities + Navigation + Booking */}
        <div className="border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* Left: Theme & Language Utilities */}
              <div className="flex items-center space-x-4">
                {/* Theme Picker */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-accent-light/50 transition-colors"
                  title="Toggle theme"
                >
                  {theme === "light" ? (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {theme === "light"
                      ? t("theme.light", "Light")
                      : t("theme.dark", "Dark")}
                  </span>
                </button>

                {/* Language Picker */}
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Select value={currentLanguage} onValueChange={setLanguage}>
                    <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto">
                      <SelectValue className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Center: Navigation Menu */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium font-body transition-colors hover:text-secondary ${
                      isActive(item.href)
                        ? "text-secondary border-b-2 border-secondary pb-1"
                        : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Right: Booking Button */}
              <div className="flex items-center space-x-4">
                <Button
                  asChild
                  className="gradient-accent text-white btn-modern shadow-medium hidden sm:flex"
                >
                  <a
                    href="https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA="
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("button.book_consultation", "Book Consultation")}
                  </a>
                </Button>

                {/* Mobile menu button */}
                <button
                  className="lg:hidden p-2 hover:bg-accent-light/50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Second Section: Logo + Name + Tagline */}
        <div className="bg-background/95 backdrop-blur-sm">
          <div className="w-fit mx-auto px-6 py-4">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-medium bg-background">
                <img
                  src="/images/header/logo.svg"
                  alt="e-Nutritionist logo"
                  className="w-10 h-10 object-contain"
                />
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-primary font-heading leading-tight">
                  e-Nutritionist
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  Professional Sports Nutrition & Wellness
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden glass-effect border-t">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block text-sm font-medium font-body transition-colors hover:text-secondary ${
                      isActive(item.href) ? "text-secondary" : "text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4">
                  <Button className="w-full gradient-accent text-white btn-modern">
                    {t("button.book_consultation", "Book Consultation")}
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">eN</span>
                </div>
                <span className="text-lg font-bold">e-Nutritionist</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional nutrition consulting specializing in athletic
                performance, weight management, and healthy lifestyle coaching.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Athletic Nutrition</li>
                <li>Weight Management</li>
                <li>Sports Performance</li>
                <li>Meal Prep Consulting</li>
                <li>Nutrition Education</li>
                <li>Body Composition Analysis</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Info</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@e-nutritionist.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Health St, Wellness City</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 e-Nutritionist. All rights reserved. Professional
              nutrition consulting services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
