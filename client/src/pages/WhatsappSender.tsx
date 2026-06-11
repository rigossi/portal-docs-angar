import DocsLayout from "@/components/DocsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, MessageSquare, Send, Key, ExternalLink, Terminal, ArrowRight, ArrowLeft, Copy } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

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
    data_solicitacao: new Date().toISOString().split('T')[0],
    valor: "",
    data_liberacao: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    parcelas: "",
    taxa_nominal: "1.64",
    iof: "0",
    valor_parcela: ""
  });

  // Atualiza valor da parcela e bruto automaticamente quando valor/parcelas mudam (estimativa simples)
  const updateCalculatedFields = (name: string, value: string) => {
    const newFormData = { ...formData, [name]: value };
    
    if (name === "valor" || name === "parcelas" || name === "taxa_nominal" || name === "iof") {
      const valor = parseFloat(newFormData.valor) || 0;
      const parcelas = parseInt(newFormData.parcelas) || 0;
      const taxa = parseFloat(newFormData.taxa_nominal) || 0;
      const iof = parseFloat(newFormData.iof) || 0;

      if (valor > 0 && parcelas > 0) {
        // Cálculo simples de juros compostos para estimativa
        const principal = valor + iof;
        const montante = principal * Math.pow(1 + (taxa / 100), parcelas);
        const parcela = montante / parcelas;
        
        newFormData.valor_parcela = parcela.toFixed(2);
      }
    }
    
    setFormData(newFormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateCalculatedFields(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setLogs([]); // Limpar logs anteriores

    const baseUrl = environment === "producao" 
      ? "https://api-angar-producao.up.railway.app" 
      : "https://api-angar-homologacao.up.railway.app";

    try {
      // 1. Validar Token
      if (!token) {
        throw new Error("Por favor, insira um Token de API válido.");
      }

      // 2. Montar Payload da Proposta
      const payload = {
        id_proposta_parceiro: `TESTE-${Date.now()}`,
        data_solicitacao: formData.data_solicitacao,
        cliente: {
          nome: formData.nome,
          cpf: "000.000.000-00", // CPF fictício para teste
          whatsapp: formData.whatsapp.replace(/\D/g, ""), // Remove formatação
        },
        simulacao: {
          valores: {
            solicitado: parseFloat(formData.valor),
            iof: parseFloat(formData.iof),
            principal: parseFloat(formData.valor) + parseFloat(formData.iof),
            parcela: parseFloat(formData.valor_parcela),
            liquido: parseFloat(formData.valor),
            bruto: parseFloat(formData.valor_parcela) * parseInt(formData.parcelas),
          },
          taxas: {
            nominal_am: parseFloat(formData.taxa_nominal),
            cet_am: parseFloat(formData.taxa_nominal) * 1.1, // Estimativa
            cet_aa: parseFloat(formData.taxa_nominal) * 12 * 1.1, // Estimativa
          },
          prazos: {
            total_parcelas: parseInt(formData.parcelas),
            data_liberacao_estimada: formData.data_liberacao,
            primeiro_vencimento: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            ultimo_vencimento: new Date(Date.now() + 30 * parseInt(formData.parcelas) * 86400000).toISOString().split('T')[0],
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
      toast.success("Mensagem enviada com sucesso!");
    } catch (err: any) {
      setError(err.message);
      if (!logs.find(l => l.type === "err")) {
        addLog("err", { message: err.message });
      }
      toast.error("Erro ao enviar mensagem.");
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
                      <Label htmlFor="data_solicitacao">Data da Solicitação</Label>
                      <Input 
                        id="data_solicitacao" 
                        name="data_solicitacao" 
                        type="date" 
                        value={formData.data_solicitacao}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data_liberacao">Data de Liberação</Label>
                      <Input 
                        id="data_liberacao" 
                        name="data_liberacao" 
                        type="date" 
                        value={formData.data_liberacao}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor Liberado (R$)</Label>
                      <Input 
                        id="valor" 
                        name="valor" 
                        type="number" 
                        placeholder="Ex: 7800" 
                        value={formData.valor}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="iof">IOF (R$)</Label>
                      <Input 
                        id="iof" 
                        name="iof" 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 150.00" 
                        value={formData.iof}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parcelas">Prazo (meses)</Label>
                      <Input 
                        id="parcelas" 
                        name="parcelas" 
                        type="number" 
                        placeholder="Ex: 24" 
                        value={formData.parcelas}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxa_nominal">Taxa Nominal (%)</Label>
                      <Input 
                        id="taxa_nominal" 
                        name="taxa_nominal" 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 1.64" 
                        value={formData.taxa_nominal}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor_parcela">Valor Parcela (R$)</Label>
                      <Input 
                        id="valor_parcela" 
                        name="valor_parcela" 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 500.00" 
                        value={formData.valor_parcela}
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
