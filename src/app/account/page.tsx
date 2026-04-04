import Link from 'next/link';
import { Bell, ChevronRight, Lock, MapPin, Sparkles, Star, User2 } from 'lucide-react';

const menuItems = [
  { icon: User2, label: 'Perfil y datos personales', href: '#' },
  { icon: Star, label: 'Rutas y paradas guardadas', href: '#' },
  { icon: Bell, label: 'Configuración de notificaciones', href: '#' },
  { icon: MapPin, label: 'Preferencias de viaje', href: '#' },
  { icon: Sparkles, label: 'Membresía', href: '/payments' },
  { icon: Lock, label: 'Privacidad y seguridad', href: '#' },
];

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Mi cuenta</h2>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-4 rounded-xl border bg-card px-4 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
          U
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold">Usuario TransitPulse</p>
          <p className="text-xs text-muted-foreground">Cuenta activa</p>
        </div>
        <span className="shrink-0 rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Plan Gratuito
        </span>
      </div>

      {/* Membership banner */}
      <Link
        href="/payments"
        className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5 hover:bg-primary/10 transition-colors"
      >
        <Sparkles className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Conoce TransitPulse Premium</p>
          <p className="text-xs text-muted-foreground">Alertas personalizadas, historial y más</p>
        </div>
        <ChevronRight className="h-4 w-4 text-primary shrink-0" />
      </Link>

      {/* Menu */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {menuItems.map(({ icon: Icon, label, href }, idx) => (
          <div key={label}>
            {idx > 0 && <div className="border-t" />}
            <a
              href={href}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors"
            >
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
