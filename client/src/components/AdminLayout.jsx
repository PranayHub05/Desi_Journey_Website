import { useContext, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import { SEO } from '../seo';
import { 
  HiOutlineChartSquareBar, 
  HiOutlineMap, 
  HiOutlineDocumentText, 
  HiOutlineChatAlt2, 
  HiOutlineLogout, 
  HiMenu, 
  HiX, 
  HiExternalLink,
  HiOutlineShieldCheck,
  HiOutlineBadgeCheck
} from 'react-icons/hi';

export default function AdminLayout({ children }) {
  const { logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/admin', icon: HiOutlineChartSquareBar, label: 'Overview', exact: true },
    { to: '/admin/tours', icon: HiOutlineMap, label: 'Tours & Trips' },
    { to: '/admin/posts', icon: HiOutlineDocumentText, label: 'Journal Posts' },
    { to: '/admin/achievements', icon: HiOutlineBadgeCheck, label: 'Certificates & Awards' },
    { to: '/admin/popups', icon: HiOutlineChatAlt2, label: 'Popups & Alerts' },
  ];

  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p.includes('/tours/new')) return 'Create Tour';
    if (p.includes('/tours/')) return 'Edit Tour';
    if (p.includes('/posts/new')) return 'Create Journal Post';
    if (p.includes('/posts/')) return 'Edit Journal Post';
    if (p.includes('/achievements/new')) return 'Add Certificate';
    if (p.includes('/achievements/')) return 'Edit Certificate';
    if (p.includes('/achievements')) return 'Certificates & Awards';
    if (p.includes('/popups')) return 'Popup Manager';
    if (p.includes('/tours')) return 'Tours Management';
    if (p.includes('/posts')) return 'Journal Management';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col lg:flex-row font-sans">
      <SEO 
        title={`Admin - ${getBreadcrumb()}`}
        noindex={true}
      />

      {/* Mobile Top Navigation */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#081325] border-b border-white/10 sticky top-0 z-50">
        <BrandLogo light compact />
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-2 text-white/80 hover:text-white rounded-xl bg-white/5"
        >
          {mobileMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#081325] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Logo Container */}
        <div className="px-7 py-7 border-b border-white/10 flex items-center justify-between">
          <BrandLogo light />
        </div>

        {/* Admin Tag */}
        <div className="mx-6 mt-6 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan to-ocean flex items-center justify-center text-white shadow-sm">
            <HiOutlineShieldCheck size={18} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan">Admin Console</p>
            <p className="text-xs text-white/60">Desi Journey CMS</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Management</p>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan/20 to-ocean/20 text-cyan font-bold shadow-sm border border-cyan/30' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#040a14]">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <HiExternalLink size={16} className="text-cyan" /> View Live Website
            </span>
            <span className="text-[10px] bg-cyan/20 text-cyan px-2 py-0.5 rounded-full font-bold">Live</span>
          </a>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
          >
            <HiOutlineLogout size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Portal</span>
            <h2 className="text-xl font-display font-bold text-slate-900">{getBreadcrumb()}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <HiExternalLink size={15} /> Visit Website
            </a>
            
            <div className="h-8 w-px bg-slate-200" />
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan/15 text-cyan font-bold flex items-center justify-center text-sm border border-cyan/30">
                A
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Administrator</p>
                <p className="text-[10px] text-slate-400">Super User</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#081325]/70 backdrop-blur-xs z-30 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
