import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Code2, FileText, Home, Webhook } from "lucide-react";
import { Link, useLocation } from "wouter";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: "Introdução", href: "/", icon: Home },
  { title: "Autenticação", href: "/autenticacao", icon: FileText },
  { title: "Envio de Propostas", href: "/propostas", icon: Code2 },
  { title: "Webhooks", href: "/webhooks", icon: Webhook },
  { title: "Guia Completo", href: "/guia-completo", icon: Book },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg leading-none">API Parcred Brasil</span>
              <span className="text-xs text-muted-foreground">Documentação</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="https://api-angar-homologacao.onrender.com/health" target="_blank" rel="noopener noreferrer">
                Status da API
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r py-6">
          <ScrollArea className="flex-1">
            <nav className="flex flex-col gap-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-6 px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Parcred Brasil. Todos os direitos reservados.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Versão 1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
}
