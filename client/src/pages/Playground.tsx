import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Loader2, CheckCircle2, XCircle, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Environment = "homologacao" | "producao";

const ENV_URLS = {
  homologacao: "https://api-angar-homologacao.onrender.com",
  producao: "https://api-angar-producao.onrender.com"
};

const DEFAULT_PAYLOAD = {
  "id_proposta_parceiro": "PROP-123456",
  "nome": "João da Silva",
  "cpf": "123.456.789-00",
  "email": "joao.silva@email.com",
  "telefone": "11999887766",
  "valor_solicitado": 5000.00,
  "parcelas": 12,
  "data_nascimento": "1990-05-15",
  "webhook_url": "https://seu-sistema.com.br/webhook/parcred"
};

export default function Playground() {
  const [env, setEnv] = useState<Environment>("homologacao");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [token, setToken] = useState("");
  const [payload, setPayload] = useState(JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: "req" | "res" | "err", content: any, timestamp: string }>>([]);

  const addLog = (type: "req" | "res" | "err", content: any) => {
    setLogs(prev => [{
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const handleLogin = async () => {
    if (!clientId || !clientSecret) {
      toast.error("Preencha Client ID e Client Secret");
      return;
    }

    setLoading(true);
    const url = `${ENV_URLS[env]}/v1/login`;

    try {
      addLog("req", {
        method: "POST",
        url,
        body: { client_id: clientId, client_secret: "******" }
      });

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret })
      });

      const data = await response.json();
      addLog(response.ok ? "res" : "err", data);

      if (response.ok && data.access_token) {
        setToken(data.access_token);
        toast.success("Autenticado com sucesso!");
      } else {
        toast.error("Falha na autenticação");
      }
    } catch (error) {
      addLog("err", { message: "Erro de conexão", error });
      toast.error("Erro ao conectar com a API");
    } finally {
      setLoading(false);
    }
  };

  const handleSendProposal = async () => {
    if (!token) {
      toast.error("Você precisa se autenticar primeiro");
      return;
    }

    try {
      const body = JSON.parse(payload);
      setLoading(true);
      const url = `${ENV_URLS[env]}/v1/propostas`;

      addLog("req", {
        method: "POST",
        url,
        headers: { Authorization: "Bearer " + token.substring(0, 10) + "..." },
        body
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      addLog(response.ok ? "res" : "err", data);

      if (response.ok) {
        toast.success("Proposta enviada com sucesso!");
      } else {
        toast.error("Erro ao enviar proposta");
      }
    } catch (error) {
      toast.error("JSON inválido ou erro de conexão");
      addLog("err", { message: "Erro ao processar requisição", error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Playground da API</h1>
          <p className="text-muted-foreground mt-2">
            Teste a integração em tempo real diretamente pelo navegador.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border p-2 rounded-lg shadow-sm">
          <Label className="text-sm font-medium px-2">Ambiente:</Label>
          <Select value={env} onValueChange={(v) => setEnv(v as Environment)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homologacao">🚧 Homologação</SelectItem>
              <SelectItem value="producao">🚀 Produção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda: Controles */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card de Autenticação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${token ? "bg-green-500" : "bg-red-500"}`} />
                1. Autenticação
              </CardTitle>
              <CardDescription>Obtenha seu token de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input 
                  placeholder="Ex: parceiro_abc_123" 
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Client Secret</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••••••••••" 
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleLogin} 
                disabled={loading || !!token}
                variant={token ? "outline" : "default"}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {token ? "Autenticado" : "Gerar Token"}
              </Button>
              
              {token && (
                <div className="p-3 bg-muted rounded-md text-xs break-all relative group">
                  <span className="font-mono text-muted-foreground">Token: {token.substring(0, 30)}...</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setToken("");
                      toast.info("Token removido");
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Envio */}
          <Card className={!token ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="text-lg">2. Enviar Proposta</CardTitle>
              <CardDescription>Simule uma nova solicitação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Payload JSON</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => setPayload(JSON.stringify(DEFAULT_PAYLOAD, null, 2))}
                  >
                    Resetar
                  </Button>
                </div>
                <Textarea 
                  className="font-mono text-xs h-[300px]" 
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSendProposal} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Enviar Requisição
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Logs e Resultados */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Console de Execução</CardTitle>
                <CardDescription>Histórico de requisições e respostas</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setLogs([])}>
                Limpar Logs
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[800px]">
                {logs.length === 0 && (
                  <div className="text-center text-muted-foreground py-20">
                    <div className="flex justify-center mb-4">
                      <Play className="h-12 w-12 opacity-20" />
                    </div>
                    <p>Nenhuma requisição realizada ainda.</p>
                    <p className="text-sm">Autentique-se e envie uma proposta para ver os logs aqui.</p>
                  </div>
                )}
                
                {logs.map((log, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden text-sm">
                    <div className={`px-4 py-2 flex items-center justify-between ${
                      log.type === "req" ? "bg-blue-500/10 text-blue-700 dark:text-blue-300" :
                      log.type === "res" ? "bg-green-500/10 text-green-700 dark:text-green-300" :
                      "bg-red-500/10 text-red-700 dark:text-red-300"
                    }`}>
                      <div className="flex items-center gap-2 font-medium">
                        {log.type === "req" ? <Play className="h-4 w-4" /> :
                         log.type === "res" ? <CheckCircle2 className="h-4 w-4" /> :
                         <XCircle className="h-4 w-4" />}
                        {log.type === "req" ? "REQUEST" : log.type === "res" ? "RESPONSE" : "ERROR"}
                      </div>
                      <span className="text-xs opacity-70">{log.timestamp}</span>
                    </div>
                    <div className="p-4 bg-muted/30 font-mono text-xs overflow-x-auto">
                      <pre>{JSON.stringify(log.content, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
