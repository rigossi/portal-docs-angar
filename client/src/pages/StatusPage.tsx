import DocsLayout from "@/components/DocsLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, RefreshCw, Server, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ServiceStatus {
  name: string;
  url: string;
  status: "online" | "offline" | "checking";
  latency?: number;
  lastChecked?: Date;
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "API de Homologação",
      url: "https://api-angar-homologacao.onrender.com/health",
      status: "checking",
    },
    {
      name: "API de Produção",
      url: "https://api-angar-producao.onrender.com/health",
      status: "checking",
    },
  ]);

  const checkStatus = async () => {
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        const start = Date.now();
        try {
          // Adiciona timestamp para evitar cache
          const response = await fetch(`${service.url}?t=${start}`, {
            method: "GET",
            mode: "cors", // Importante para requisições cross-origin
          });
          
          const end = Date.now();
          const latency = end - start;

          if (response.ok) {
            return {
              ...service,
              status: "online" as const,
              latency,
              lastChecked: new Date(),
            };
          } else {
            throw new Error("Status not OK");
          }
        } catch (error) {
          return {
            ...service,
            status: "offline" as const,
            latency: 0,
            lastChecked: new Date(),
          };
        }
      })
    );

    setServices(updatedServices);
  };

  useEffect(() => {
    checkStatus();
    // Atualiza a cada 60 segundos
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DocsLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Status da API</h1>
            </div>
            <Button variant="outline" size="sm" onClick={checkStatus} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar Agora
            </Button>
          </div>
          <p className="text-xl text-muted-foreground">
            Monitoramento em tempo real da disponibilidade dos serviços da API Parcred Brasil.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.name} className={service.status === "offline" ? "border-destructive/50" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {service.name}
                </CardTitle>
                <Server className={`h-4 w-4 ${
                  service.status === "online" ? "text-green-500" : 
                  service.status === "offline" ? "text-destructive" : "text-muted-foreground"
                }`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {service.status === "checking" && (
                      <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                    {service.status === "online" && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {service.status === "offline" && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    
                    <span className="text-2xl font-bold">
                      {service.status === "checking" ? "Verificando..." :
                       service.status === "online" ? "Operacional" : "Indisponível"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Latência: {service.status === "online" ? `${service.latency}ms` : "-"}
                  </span>
                  <span>
                    Última verificação: {service.lastChecked ? service.lastChecked.toLocaleTimeString() : "-"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Maintenance Info */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Informações de Manutenção</h3>
          <p className="text-muted-foreground text-sm">
            Nenhuma manutenção programada para os próximos 7 dias.
            Caso encontre problemas não reportados aqui, entre em contato com o suporte em <a href="mailto:administrador.ti@parcredbrasil.com.br" className="text-primary hover:underline">administrador.ti@parcredbrasil.com.br</a>.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
}
