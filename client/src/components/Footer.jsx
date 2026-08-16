import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-[#03142f] py-14 text-white">
      <div className="container-luxe">
        <div className="grid gap-10 md:grid-cols-[1.3fr_.8fr_1fr]">
          <div>
            <BrandLogo light />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              Turning journeys into unforgettable memories. Travel that stays with you, long after you return.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Social 
                icon={<FaWhatsapp />} 
                label="WhatsApp" 
                url="https://wa.me/919748424597" 
                hoverClass="hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
              />
              <Social 
                icon={<FaInstagram />} 
                label="Instagram" 
                url="https://www.instagram.com/desijourneyglobal/" 
                hoverClass="hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white"
              />
              <Social 
                icon={<FaFacebookF />} 
                label="Facebook" 
                url="https://www.facebook.com/soma.mukherjee.1675" 
                hoverClass="hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan">Explore</p>
            <nav className="mt-4 grid gap-2.5 text-sm text-white/65">
              <Link to="/destinations" className="hover:text-cyan transition-colors">Featured trips</Link>
              <Link to="/about" className="hover:text-cyan transition-colors">Our story</Link>
              <Link to="/gallery" className="hover:text-cyan transition-colors">Gallery</Link>
              <Link to="/blog" className="hover:text-cyan transition-colors">Journal</Link>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan">Get in touch</p>
            <a className="mt-4 block text-sm text-white/70 hover:text-cyan transition-colors" href="mailto:info@desijourney.com">
              info@desijourney.com
            </a>
            <a 
              className="mt-2 block text-sm text-white/70 hover:text-cyan transition-colors" 
              href="https://wa.me/919748424597"
              target="_blank"
              rel="noopener noreferrer"
            >
              +91 97484 24597
            </a>
            <p className="mt-5 text-xs leading-5 text-white/45">
              Kolkata, India<br />
              Planning remarkable journeys worldwide.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Desi Journey. All rights reserved.</p>
          <p>Designed with <span className="text-cyan">♥</span> for the journey ahead.</p>
        </div>
      </div>
    </footer>
  );
}

function Social({ icon, label, url, hoverClass }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`grid size-10 place-items-center rounded-full border border-white/20 text-sm text-white/75 transition-all duration-300 transform hover:-translate-y-1 ${hoverClass}`}
    >
      {icon}
    </a>
  );
}
