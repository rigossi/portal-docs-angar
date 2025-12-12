import CodeBlock from "@/components/CodeBlock";
import DocsLayout from "@/components/DocsLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowRight, Shield, Webhook } from "lucide-react";
import { Link } from "wouter";

export default function Webhooks() {
  const payloadExample = `{
  "id_proposta_angar": "ANG-d250f450-c920-44fc-ad2b-d4d17e94b5bc",
  "id_proposta_parceiro": "PROP-XYZ-98765",
  "status": "ACEITO",
  "timestamp": "2025-12-12T21:58:36.846Z",
  "detalhes": ""
}`;

  const validationExample = `const crypto = require("crypto");

function validarAssinatura(req, keyAngar) {
  // 1. Extrair a assinatura recebida do header
  const assinaturaRecebida = req.headers["x-angar-signature"];
  if (!assinaturaRecebida) {
    throw new Error("Header x-angar-signature ausente.");
  }

  // 2. Obter o corpo cru (raw body) da requisição
  const corpoCru = JSON.stringify(req.body);

  // 3. Calcular a assinatura esperada
  const assinaturaCalculada = crypto
    .createHmac("sha256", keyAngar)
    .update(corpoCru)
    .digest("hex");

  // 4. Comparar as assinaturas de forma segura
  const assinaturasCoincidem = crypto.timingSafeEqual(
    Buffer.from(assinaturaRecebida, "hex"),
    Buffer.from(assinaturaCalculada, "hex")
  );

  if (!assinaturasCoincidem) {
    throw new Error("Assinatura inválida.");
  }

  return true;
}`;

  const serverExample = `const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const KEY_ANGAR_SECRETA = process.env.KEY_ANGAR_SECRETA;

app.post("/webhook/angar", (req, res) => {
  try {
    // 1. Validar a assinatura
    validarAssinatura(req, KEY_ANGAR_SECRETA);

    // 2. Processar os dados
    const { id_proposta_parceiro, status } = req.body;
    console.log(\`Proposta \${id_proposta_parceiro} atualizada para: \${status}\`);

    if (status === "ACEITO") {
      // Lógica para aprovar o empréstimo no seu sistema
      aprovarEmprestimo(id_proposta_parceiro);
    } else if (status === "RECUSADO") {
      // Lógica para registrar a recusa
      rejeitarEmprestimo(id_proposta_parceiro);
    }

    // 3. Responder com sucesso
    res.status(200).json({ received: true });

  } catch (error) {
    console.error("Erro ao processar webhook:", error.message);
    res.status(400).json({ error: error.message });
  }
});

function validarAssinatura(req, keyAngar) { /* ... */ }

app.listen(3000, () => {
  console.log("Servidor de webhook rodando na porta 3000");
});`;

  return (
    <DocsLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Webhook className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Webhooks</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Receba notificações em tempo real quando o cliente aceitar ou recusar uma proposta.
          </p>
        </div>

        {/* Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">
            Quando o cliente final interagir com a proposta (aceitando ou recusando), a API Angar enviará uma notificação POST para a URL de webhook que você informou ao criar a proposta.
          </p>
        </div>

        {/* Implementation */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Implementação do Endpoint</h2>
          <p className="text-muted-foreground">
            Seu sistema deve expor um endpoint público (HTTPS) para receber nossas notificações.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Requisitos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Método: <code className="bg-muted px-1.5 py-0.5 rounded">POST</code></li>
                <li>Content-Type: <code className="bg-muted px-1.5 py-0.5 rounded">application/json</code></li>
                <li>Protocolo: HTTPS (recomendado)</li>
                <li>Timeout: Responder em até 10 segundos</li>
                <li>Status de sucesso: <code className="bg-muted px-1.5 py-0.5 rounded">200 OK</code></li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Payload */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Payload do Webhook</h2>
          <CodeBlock code={payloadExample} language="json" title="Exemplo de Payload" />
          
          <Card>
            <CardHeader>
              <CardTitle>Campos</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <TableCell className="font-mono">id_proposta_angar</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>ID da proposta no sistema Angar</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">id_proposta_parceiro</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>ID da proposta no seu sistema</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">status</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>Status final: <code>ACEITO</code> ou <code>RECUSADO</code></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">timestamp</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>Data e hora do evento (ISO 8601)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">detalhes</TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>Informações adicionais (reservado para uso futuro)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Security */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Segurança: Validação da Assinatura
          </h2>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validação Obrigatória</AlertTitle>
            <AlertDescription>
              Para garantir que a requisição veio da Angar, cada webhook é assinado usando <strong>HMAC-SHA256</strong>. A assinatura é enviada no header <code>x-angar-signature</code>. É fundamental que você valide esta assinatura antes de processar o webhook.
            </AlertDescription>
          </Alert>

          <p className="text-muted-foreground">
            A chave secreta (<code className="bg-muted px-1.5 py-0.5 rounded">KEY_ANGAR</code>) será fornecida pela equipe Angar. Mantenha-a segura e nunca a exponha publicamente.
          </p>

          <CodeBlock code={validationExample} language="javascript" title="Função de Validação (Node.js)" />
        </div>

        {/* Complete Example */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Exemplo Completo de Servidor</h2>
          <CodeBlock code={serverExample} language="javascript" title="Servidor Express (Node.js)" />
        </div>

        {/* Response */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Resposta Esperada</h2>
          <p className="text-muted-foreground">
            Seu endpoint deve responder com <code className="bg-muted px-1.5 py-0.5 rounded">HTTP 200 OK</code> em até 10 segundos. Caso contrário, a API Angar poderá considerar a entrega como falha.
          </p>
          <CodeBlock
            code={`{
  "received": true
}`}
            language="json"
            title="200 OK"
          />
        </div>

        {/* Error Handling */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Tratamento de Erros</h2>
          <Card>
            <CardHeader>
              <CardTitle>Códigos de Status Recomendados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Quando Usar</TableHead>
                    <TableHead>Retry?</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">200</TableCell>
                    <TableCell>Webhook processado com sucesso</TableCell>
                    <TableCell>Não</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">400</TableCell>
                    <TableCell>Erro permanente (assinatura inválida, dados malformados)</TableCell>
                    <TableCell>Não</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">500</TableCell>
                    <TableCell>Erro temporário no seu sistema</TableCell>
                    <TableCell>Sim</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">503</TableCell>
                    <TableCell>Serviço temporariamente indisponível</TableCell>
                    <TableCell>Sim</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Testing */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Testando seu Webhook</h2>
          <p className="text-muted-foreground">
            Para testar seu webhook antes de integrar com a API real, você pode usar serviços como:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>webhook.site</CardTitle>
                <CardDescription>Serviço gratuito para testes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Gera uma URL temporária que mostra todas as requisições recebidas em tempo real.
                </p>
                <a
                  href="https://webhook.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Acessar webhook.site →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ngrok</CardTitle>
                <CardDescription>Túnel para localhost</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Expõe seu servidor local para a internet, permitindo testar em desenvolvimento.
                </p>
                <a
                  href="https://ngrok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Acessar ngrok.com →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Próximo Passo</h2>
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Guia Completo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Veja o fluxo completo de integração com exemplos práticos passo a passo:
              </p>
              <Link href="/guia-completo">
                <div className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer">
                  <span className="font-medium">Ver Guia Completo</span>
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
