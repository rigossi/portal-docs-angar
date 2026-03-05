import DocsLayout from "@/components/DocsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, MessageSquare, Send, Key, ExternalLink, Terminal, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function WhatsappSender() {
  const [environment, setEnvironment] = useState("homologacao");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Array<{ type: "req" | "res" | "err", content: any, timestamp: string }>>([]);

  const addLog = (type: "req" | "res" | "err", content: any) => {
    setLogs(prev => [{
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    valor: "",
    parcelas: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setLogs([]); // Limpar logs anteriores

    const baseUrl = environment === "producao" 
      ? "https://api-angar-producao.onrender.com" 
      : "https://api-angar-homologacao.onrender.com";

    try {
      // 1. Validar Token
      if (!token) {
        throw new Error("Por favor, insira um Token de API válido.");
      }

      // 2. Montar Payload da Proposta
      const payload = {
        id_proposta_parceiro: `TESTE-${Date.now()}`,
        cliente: {
          nome: formData.nome,
          cpf: "000.000.000-00", // CPF fictício para teste
          whatsapp: formData.whatsapp.replace(/\D/g, ""), // Remove formatação
        },
        simulacao: {
          valores: {
            solicitado: parseFloat(formData.valor),
            iof: 0,
            principal: parseFloat(formData.valor),
            parcela: parseFloat(formData.valor) / parseInt(formData.parcelas),
            liquido: parseFloat(formData.valor),
            bruto: parseFloat(formData.valor),
          },
          taxas: {
            cet_am: 1.5,
            cet_aa: 19.56,
          },
          prazos: {
            total_parcelas: parseInt(formData.parcelas),
            primeiro_vencimento: new Date().toISOString().split('T')[0],
            ultimo_vencimento: new Date().toISOString().split('T')[0],
          },
        },
        webhook_url: "https://webhook.site/seu-webhook-teste", // Webhook fictício
      };

      addLog("req", {
        method: "POST",
        url: `${baseUrl}/v1/propostas`,
        headers: { Authorization: "Bearer " + token.substring(0, 10) + "..." },
        body: payload
      });

      // 3. Enviar Requisição
      const response = await fetch(`${baseUrl}/v1/propostas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      addLog(response.ok ? "res" : "err", data);

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar proposta.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
      if (!logs.find(l => l.type === "err")) {
        addLog("err", { message: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocsLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Testar WhatsApp</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Ferramenta dedicada para testar o envio de mensagens WhatsApp via API.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulário */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Mensagem</CardTitle>
                <CardDescription>Preencha os campos para disparar o template.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="space-y-2">
                    <Label htmlFor="environment">Ambiente</Label>
                    <Select value={environment} onValueChange={setEnvironment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ambiente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homologacao">Homologação (Teste)</SelectItem>
                        <SelectItem value="producao">Produção (Real)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="token">Token de Acesso (Bearer)</Label>
                      <Link href="/playground">
                        <div className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
                          <Key className="h-3 w-3" />
                          Gerar Token no Playground
                        </div>
                      </Link>
                    </div>
                    <Input 
                      id="token" 
                      type="password" 
                      placeholder="Cole seu token JWT aqui..." 
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                    <Alert className="py-2 mt-2 bg-muted/50 border-none">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <AlertDescription className="text-xs text-muted-foreground ml-2">
                        Não tem um token? Vá ao <Link href="/playground"><span className="underline cursor-pointer font-medium">Playground</span></Link>, insira suas credenciais (Client ID/Secret) e clique em "Gerar Token". Copie o token gerado e cole aqui.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome do Cliente</Label>
                      <Input 
                        id="nome" 
                        name="nome" 
                        placeholder="Ex: João Silva" 
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp (com DDI)</Label>
                      <Input 
                        id="whatsapp" 
                        name="whatsapp" 
                        placeholder="Ex: 5511999998888" 
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor Solicitado (R$)</Label>
                      <Input 
                        id="valor" 
                        name="valor" 
                        type="number" 
                        placeholder="Ex: 5000" 
                        value={formData.valor}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parcelas">Qtd. Parcelas</Label>
                      <Input 
                        id="parcelas" 
                        name="parcelas" 
                        type="number" 
                        placeholder="Ex: 12" 
                        value={formData.parcelas}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem Teste
                      </>
                    )}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Console de Logs */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Console de Execução
                </CardTitle>
                <CardDescription>Acompanhe o payload enviado e a resposta da API.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[800px]">
                  {logs.length === 0 && (
                    <div className="text-center text-muted-foreground py-20">
                      <div className="flex justify-center mb-4">
                        <Send className="h-12 w-12 opacity-20" />
                      </div>
                      <p>Aguardando envio...</p>
                      <p className="text-sm max-w-[250px] mx-auto">
                        Preencha o formulário ao lado e clique em enviar para ver os detalhes da requisição aqui.
                      </p>
                    </div>
                  )}
                  
                  {logs.map((log, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden text-sm shadow-sm">
                      <div className={`px-4 py-2 flex items-center justify-between ${
                        log.type === "req" ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-b border-blue-200 dark:border-blue-800" :
                        log.type === "res" ? "bg-green-500/10 text-green-700 dark:text-green-300 border-b border-green-200 dark:border-green-800" :
                        "bg-red-500/10 text-red-700 dark:text-red-300 border-b border-red-200 dark:border-red-800"
                      }`}>
                        <div className="flex items-center gap-2 font-medium">
                          {log.type === "req" ? <ArrowRight className="h-4 w-4" /> :
                           log.type === "res" ? <ArrowLeft className="h-4 w-4" /> :
                           <AlertCircle className="h-4 w-4" />}
                          {log.type === "req" ? "REQUEST (Enviado)" : log.type === "res" ? "RESPONSE (Recebido)" : "ERROR"}
                        </div>
                        <span className="text-xs opacity-70 font-mono">{log.timestamp}</span>
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
    </DocsLayout>
  );
}
