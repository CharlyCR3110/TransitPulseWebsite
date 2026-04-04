import { Bell, ChevronRight, Lock, MapPin, Star, User2 } from 'lucide-react';

const menuItems = [
  { icon: User2, label: 'Perfil y datos personales', href: '#' },
  { icon: Star, label: 'Rutas y paradas guardadas', href: '#' },
  { icon: Bell, label: 'Configuración de notificaciones', href: '#' },
  { icon: MapPin, label: 'Preferencias de viaje', href: '#' },
  { icon: Lock, label: 'Privacidad y seguridad', href: '#' },
];

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Mi cuenta</h2>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-4 rounded-xl border bg-card px-4 py-4 mb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
          U
        </div>
        <div>
          <p className="font-semibold">Usuario TransitPulse</p>
          <p className="text-xs text-muted-foreground">Cuenta activa</p>
        </div>
      </div>

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
