import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Upload, Menu, X, LogOut, User as UserIcon, Sun, Moon, Sparkles, CreditCard, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-sm">A</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground hidden sm:block">Artivault</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search artworks, artists..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </form>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                <Upload className="w-4 h-4" />
                Upload
              </Link>
              <Link to="/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Link>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                  <img src={user?.avatar} alt="" className="w-full h-full object-cover" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl py-1 animate-scale-in">
                    <Link to={`/profile/${user?.id}`} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                      <UserIcon className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/collections" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                      <Menu className="w-4 h-4" /> Collections
                    </Link>
                    <Link to="/ai-generate" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                      <Sparkles className="w-4 h-4" /> AI Generate
                    </Link>
                    <Link to="/subscription" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                      <CreditCard className="w-4 h-4" /> Subscription
                    </Link>
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button onClick={() => { logout(); setProfileOpen(false); navigate('/'); }} className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors w-full">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
              <Link to="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Sign Up</Link>
            </div>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border p-4 space-y-3 animate-fade-in">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          </form>
          {isAuthenticated ? (
            <>
              <Link to="/upload" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">Upload</Link>
              <Link to="/notifications" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">Notifications</Link>
              <Link to={`/profile/${user?.id}`} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">Profile</Link>
              <Link to="/collections" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">Collections</Link>
              <Link to="/ai-generate" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">AI Generate</Link>
              <Link to="/subscription" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">Subscription</Link>
              <Link to="/settings" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">Settings</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block px-4 py-2 text-sm text-destructive hover:bg-secondary rounded-lg w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">Log In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
