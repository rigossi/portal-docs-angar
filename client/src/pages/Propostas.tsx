import CodeBlock from "@/components/CodeBlock";
import DocsLayout from "@/components/DocsLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowRight, Send } from "lucide-react";
import { Link } from "wouter";

export default function Propostas() {
  const requestExample = `TOKEN="SEU_TOKEN_DE_ACESSO"

curl -X POST https://api-angar-homologacao.onrender.com/v1/propostas \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{
    "id_proposta_parceiro": "PROP-XYZ-98765",
    "data_solicitacao": "2026-03-12",
    "cliente": {
      "nome": "Maria Joaquina de Amaral Pereira",
      "cpf": "123.456.789-00",
      "whatsapp": "5511987654321"
    },
    "simulacao": {
      "valores": {
        "solicitado": 1492.63,
        "iof": 48.19,
        "principal": 1540.82,
        "parcela": 156.84,
        "liquido": 1492.63,
        "bruto": 3764.16
      },
      "taxas": {
        "nominal_am": 1.64,
        "cet_am": 8.40,
        "cet_aa": 163.11
      },
      "prazos": {
        "total_parcelas": 24,
        "data_liberacao_estimada": "2026-03-15",
        "primeiro_vencimento": "2026-04-15",
        "ultimo_vencimento": "2028-03-15"
      }
    },
    "webhook_url": "https://api.seu-sistema.com/webhook/parcred"
  }'`;

  const responseExample = `{
  "status": "proposta_recebida_e_notificacao_enviada",
  "id_proposta_angar": "ANG-d250f450-c920-44fc-ad2b-d4d17e94b5bc"
}`;

  return (
    <DocsLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Send className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Envio de Propostas</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Envie propostas de empréstimo para análise e notificação do cliente final.
          </p>
        </div>

        {/* Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">
            Após autenticar, você pode enviar propostas de empréstimo contendo os dados do cliente e da simulação financeira. A API Parcred Brasil processará a proposta e enviará uma mensagem via WhatsApp para o cliente confirmar ou recusar.
          </p>
        </div>

        {/* Endpoint */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Endpoint</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-mono">POST</span>
                <code className="text-base">/v1/propostas</code>
              </CardTitle>
              <CardDescription>Criar uma nova proposta de empréstimo</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Autenticação Obrigatória</AlertTitle>
                <AlertDescription>
                  Este endpoint requer um token JWT válido no header <code>Authorization</code>.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Request Body */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Request Body</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Campos Principais</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Obrigatório</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">id_proposta_parceiro</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>Sim</TableCell>
                    <TableCell>ID único da proposta no seu sistema</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">data_solicitacao</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>Sim</TableCell>
                    <TableCell>Data da solicitação (YYYY-MM-DD)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">cliente</TableCell>
                    <TableCell>Object</TableCell>
                    <TableCell>Sim</TableCell>
                    <TableCell>Dados do cliente final</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">simulacao</TableCell>
                    <TableCell>Object</TableCell>
                    <TableCell>Sim</TableCell>
                    <TableCell>Dados financeiros da simulação</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">webhook_url</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>Sim</TableCell>
                    <TableCell>URL para receber notificações de status</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objeto Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Formato</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">nome</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>Nome completo do cliente</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">cpf</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>XXX.XXX.XXX-XX</TableCell>
                    <TableCell>CPF do cliente</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">whatsapp</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>55DDDNUMERO</TableCell>
                    <TableCell>Número do WhatsApp (com código do país)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objeto Simulação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">valores (Object)</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">solicitado</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Valor solicitado pelo cliente</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">iof</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Valor do IOF</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">principal</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Valor principal (solicitado + IOF)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">parcela</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Valor de cada parcela</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">liquido</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Valor líquido a receber</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">bruto</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Valor bruto total</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">taxas (Object)</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">nominal_am</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Taxa nominal ao mês (%)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">cet_am</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>CET ao mês (%)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">cet_aa</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>CET ao ano (%)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">prazos (Object)</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Formato</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">total_parcelas</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>Número total de parcelas</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">data_liberacao_estimada</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>YYYY-MM-DD</TableCell>
                      <TableCell>Data estimada para liberação do crédito</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">primeiro_vencimento</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>YYYY-MM-DD</TableCell>
                      <TableCell>Data do primeiro vencimento</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">ultimo_vencimento</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>YYYY-MM-DD</TableCell>
                      <TableCell>Data do último vencimento</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Example Request */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Exemplo de Requisição</h2>
          <CodeBlock code={requestExample} language="bash" title="cURL" />
        </div>

        {/* Example Response */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Resposta de Sucesso</h2>
          <CodeBlock code={responseExample} language="json" title="200 OK" />
          <p className="text-muted-foreground">
            Guarde o <code className="bg-muted px-1.5 py-0.5 rounded">id_proposta_angar</code> retornado. Ele será usado na notificação do webhook quando o cliente responder.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">O que Acontece Depois?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <CardTitle className="text-lg">Mensagem Enviada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  O cliente recebe uma mensagem via WhatsApp com os detalhes da proposta.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <CardTitle className="text-lg">Cliente Responde</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  O cliente clica no link e aceita ou recusa a proposta.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <CardTitle className="text-lg">Webhook Notificado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Você recebe uma notificação POST na sua webhook_url com o status.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Próximo Passo</h2>
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Implementar Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Agora você precisa implementar um endpoint para receber as notificações de status:
              </p>
              <Link href="/webhooks">
                <div className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer">
                  <span className="font-medium">Ir para Webhooks</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DocsLayout>
  );
}
