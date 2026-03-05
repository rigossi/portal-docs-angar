import DocsLayout from "@/components/DocsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, MessageSquare, Send, Key, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function WhatsappSender() {
  const [environment, setEnvironment] = useState("homologacao");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar proposta.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
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

          {/* Resultado */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Resultado da Requisição</CardTitle>
                <CardDescription>A resposta da API aparecerá aqui.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {result && (
                  <div className="space-y-4">
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle>Sucesso!</AlertTitle>
                      <AlertDescription>
                        A proposta foi criada e a mensagem enviada para o WhatsApp.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="rounded-md bg-muted p-4 overflow-auto max-h-[400px]">
                      <pre className="text-xs font-mono">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {!result && !error && (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm italic space-y-4">
                    <div className="p-4 bg-muted rounded-full">
                      <Send className="h-8 w-8 opacity-20" />
                    </div>
                    <p>Aguardando envio...</p>
                    <p className="text-xs max-w-[250px] text-center">
                      Preencha o formulário ao lado e clique em enviar para testar a integração.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
