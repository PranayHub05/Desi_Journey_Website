import { useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';
import SectionHeading from './SectionHeading';

export default function ContactPreview({ compact = false }) {
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };

  const socials = [
    {
      name: 'WhatsApp Business',
      handle: '+91 97484 24597',
      url: 'https://wa.me/919748424597',
      icon: FaWhatsapp,
      brandColor: '#25D366',
      bgClass: 'bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border-[#25D366]/20 shadow-hover-[#25D366]',
      hoverGlow: 'hover:shadow-[0_10px_25px_rgba(37,211,102,0.35)]',
    },
    {
      name: 'Instagram',
      handle: '@desijourneyglobal',
      url: 'https://www.instagram.com/desijourneyglobal/',
      icon: FaInstagram,
      brandColor: '#E4405F',
      bgClass: 'bg-[#E4405F]/10 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-[#E4405F] hover:text-white border-[#E4405F]/20',
      hoverGlow: 'hover:shadow-[0_10px_25px_rgba(228,64,95,0.35)]',
    },
    {
      name: 'Facebook',
      handle: 'Desi Journey Community',
      url: 'https://www.facebook.com/soma.mukherjee.1675',
      icon: FaFacebookF,
      brandColor: '#1877F2',
      bgClass: 'bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border-[#1877F2]/20',
      hoverGlow: 'hover:shadow-[0_10px_25px_rgba(24,119,242,0.35)]',
    },
  ];

  return (
    <section id="contact" className={`bg-sand ${compact ? 'py-16' : 'section-space'}`}>
      <div className="container-luxe grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-8">
          <div>
            <SectionHeading 
              eyebrow="Start somewhere beautiful" 
              title="Tell us what you’re dreaming of." 
              text="A few details are all we need. Your personal travel designer will be in touch within one business day." 
            />
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <a 
              href="mailto:info@desijourney.com" 
              className="flex items-center gap-3.5 text-sm text-ink/75 hover:text-ocean transition"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-white text-ocean shadow-xs border border-ink/5">
                <HiOutlineMail size={18} />
              </span>
              <span>info@desijourney.com</span>
            </a>

            <a 
              href="https://wa.me/919748424597" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 text-sm text-ink/75 hover:text-ocean transition"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-white text-ocean shadow-xs border border-ink/5">
                <HiOutlinePhone size={18} />
              </span>
              <span>+91 97484 24597</span>
            </a>

            <div className="flex items-center gap-3.5 text-sm text-ink/75">
              <span className="grid size-10 place-items-center rounded-xl bg-white text-ocean shadow-xs border border-ink/5">
                <HiOutlineLocationMarker size={18} />
              </span>
              <span>Kolkata, India • Planning worldwide</span>
            </div>
          </div>

          {/* Dedicated Socials Section */}
          <div className="pt-6 border-t border-ink/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[.18em] text-ocean">
              Connect on Socials
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1.5 ${soc.bgClass} ${soc.hoverGlow}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <soc.icon size={22} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">↗</span>
                  </div>
                  <div>
                    <p className="font-bold text-xs leading-tight">{soc.name}</p>
                    <p className="text-[11px] opacity-75 mt-0.5 line-clamp-1">{soc.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={submit} className="rounded-[2rem] bg-white p-7 sm:p-10 shadow-xl shadow-ocean/5 border border-ink/5 space-y-5">
          <h3 className="font-display text-2xl text-ink font-bold mb-2">Send a Message</h3>
          
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" placeholder="Your full name" />
            <Field label="Email" name="email" type="email" placeholder="you@email.com" />
            <Field label="Phone" name="phone" type="tel" placeholder="+91 97484 24597" />
            <Field label="Dates / Month" name="dates" placeholder="e.g. October 2026" />
          </div>

          <label className="block text-xs font-bold uppercase tracking-[.14em] text-ink/60">
            Your travel wish
            <textarea 
              required 
              name="message" 
              rows="4" 
              className="mt-2 w-full resize-none rounded-2xl border border-ink/10 bg-sand/40 p-4 text-sm text-ink outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/15 font-medium placeholder:text-ink/35" 
              placeholder="Where would you love to go? Tell us your preferred rhythm and stays." 
            />
          </label>

          {sent && (
            <p role="status" className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-700">
              ✓ Thank you! Your travel wish has been received. Our concierge will be in touch shortly.
            </p>
          )}

          <button className="gold-button w-full sm:w-auto py-4 px-8 text-sm shadow-md hover:shadow-lg">
            Send my travel wish
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text', placeholder }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-[.14em] text-ink/60">
      {label}
      <input 
        required 
        name={name} 
        type={type} 
        placeholder={placeholder} 
        className="mt-2 w-full rounded-2xl border border-ink/10 bg-sand/40 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-cyan focus:ring-2 focus:ring-cyan/15 font-medium" 
      />
    </label>
  );
}
