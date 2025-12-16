import CodeBlock from "@/components/CodeBlock";
import DocsLayout from "@/components/DocsLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowRight, Key } from "lucide-react";
import { Link } from "wouter";

export default function Autenticacao() {
  const requestExample = `curl -X POST https://api-parcred-homologacao.onrender.com/v1/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "SEU_CLIENT_ID",
    "client_secret": "SEU_CLIENT_SECRET"
  }'`;

  const responseExample = `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`;

  return (
    <DocsLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Autenticação</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Aprenda como obter e usar tokens de acesso JWT para autenticar suas requisições.
          </p>
        </div>

        {/* Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">
            A API Parcred Brasil utiliza o padrão <strong>JWT (JSON Web Token)</strong> para autenticação. Todas as requisições aos endpoints protegidos devem incluir um token válido no header <code className="bg-muted px-1.5 py-0.5 rounded">Authorization</code>.
          </p>
        </div>

        {/* Credentials Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Credenciais de Acesso</AlertTitle>
          <AlertDescription>
            Entre em contato com a equipe Parcred Brasil para receber suas credenciais (<code>client_id</code> e <code>client_secret</code>). Mantenha essas informações seguras e nunca as exponha em código client-side.
          </AlertDescription>
        </Alert>

        {/* Endpoint */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Endpoint de Login</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-mono">POST</span>
                <code className="text-base">/v1/login</code>
              </CardTitle>
              <CardDescription>Obtenha um token de acesso JWT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Request Body</h3>
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
                      <TableCell className="font-mono">client_id</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Sim</TableCell>
                      <TableCell>Identificador único do parceiro</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">client_secret</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Sim</TableCell>
                      <TableCell>Chave secreta do parceiro</TableCell>
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
          
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campo</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono">access_token</TableCell>
                  <TableCell>Token JWT para usar nas próximas requisições</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">token_type</TableCell>
                  <TableCell>Tipo do token (sempre "Bearer")</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">expires_in</TableCell>
                  <TableCell>Tempo de validade em segundos (3600 = 1 hora)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Using the Token */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Usando o Token</h2>
          <p className="text-muted-foreground">
            Após obter o token, você deve incluí-lo no header <code className="bg-muted px-1.5 py-0.5 rounded">Authorization</code> de todas as requisições subsequentes:
          </p>
          <CodeBlock
            code={`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
            language="http"
            title="Header de Autorização"
          />
        </div>

        {/* Token Expiration */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Expiração do Token</AlertTitle>
          <AlertDescription>
            Os tokens expiram após 1 hora (3600 segundos). Implemente uma lógica para renovar o token automaticamente ou gerar um novo quando receber um erro 401 (Unauthorized).
          </AlertDescription>
        </Alert>

        {/* Next Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Próximo Passo</h2>
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Enviar Propostas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Agora que você sabe como autenticar, vamos aprender a enviar propostas de empréstimo:
              </p>
              <Link href="/propostas">
                <div className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer">
                  <span className="font-medium">Ir para Envio de Propostas</span>
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
