import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { ORG, navLinks } from "@/data/gencb";
import logoAsset from "@/assets/logo-gencb.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 bg-gradient-brand text-white dark:text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="glass flex size-14 items-center justify-center rounded-2xl p-1.5 border border-white/30 bg-white/10 backdrop-blur-md">
              <img
                src={logoAsset.url}
                alt="Logo Generasi Cerdas Beraksi"
                width={48}
                height={48}
                loading="lazy"
                className="size-full object-contain"
              />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-white dark:text-white">{ORG.short}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/90 dark:text-white/90">{ORG.name}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/90 dark:text-white/90">{ORG.tagline}</p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: Instagram, href: "https://instagram.com" },
              { icon: Facebook, href: "https://facebook.com" },
              { icon: Youtube, href: "https://youtube.com" },
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass flex size-10 items-center justify-center rounded-full text-white dark:text-white border border-white/30 bg-white/10 backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/20"
                >
                  <Icon className="size-4 text-white dark:text-white" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-white dark:text-white">Quick Links</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {navLinks.map((link) => {
              const target = link.href || (link as { to?: string }).to || "/";
              return (
                <Link
                  key={target}
                  to={target}
                  className="text-white/85 dark:text-white/85 font-medium transition-all hover:text-white hover:translate-x-1"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-white dark:text-white">Kontak</p>
          <ul className="mt-4 flex flex-col gap-3.5 text-sm text-white/90 dark:text-white/90">
            <li className="flex gap-3 items-start">
              <MapPin className="mt-0.5 size-4 shrink-0 text-white dark:text-white" />
              <span className="leading-snug">{ORG.address}</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="size-4 shrink-0 text-white dark:text-white" />
              <a href={`tel:${ORG.phone}`} className="hover:underline hover:text-white">
                {ORG.phone}
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="size-4 shrink-0 text-white dark:text-white" />
              <a href={`mailto:${ORG.email}`} className="hover:underline hover:text-white font-medium">
                {ORG.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 px-4 py-6 text-center text-xs text-white/90 dark:text-white/90 font-medium">
        © {new Date().getFullYear()} {ORG.name}. Made with ❤️ by GEN-CB
      </div>
    </footer>
  );
}