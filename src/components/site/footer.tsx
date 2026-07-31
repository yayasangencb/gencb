import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { ORG, navLinks } from "@/data/gencb";
import logoAsset from "@/assets/logo-gencb.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 bg-gradient-brand text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="glass flex size-14 items-center justify-center rounded-2xl p-1.5">
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
              <p className="font-display text-lg font-bold">{ORG.short}</p>
              <p className="text-xs uppercase tracking-widest opacity-80">{ORG.name}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed opacity-85">{ORG.tagline}</p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <span
                key={i}
                className="glass flex size-10 items-center justify-center rounded-full transition-transform hover:scale-105"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-widest">Quick Links</p>
          <div className="mt-4 flex flex-col gap-2 text-sm opacity-85">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition-opacity hover:opacity-100">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-widest">Kontak</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm opacity-85">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {ORG.address}
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 shrink-0" />
              {ORG.phone}
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 shrink-0" />
              {ORG.email}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 px-4 py-6 text-center text-xs opacity-80">
        © {new Date().getFullYear()} {ORG.name}. Made with ❤️ by GEN-CB
      </div>
    </footer>
  );
}