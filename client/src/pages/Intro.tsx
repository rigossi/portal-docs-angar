import CodeBlock from "@/components/CodeBlock";
import DocsLayout from "@/components/DocsLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, CheckCircle, Server } from "lucide-react";
import { Link } from "wouter";

export default function Intro() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">API de Empréstimos Angar</h1>
          <p className="text-xl text-muted-foreground">
            Documentação completa para integração com a plataforma de empréstimos pessoais da Angar.
          </p>
        </div>

        {/* Quick Start Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Comece Rapidamente</AlertTitle>
          <AlertDescription>
            Esta documentação fornece tudo que você precisa para integrar sua aplicação com a API Angar.
            Siga os passos em ordem para uma integração bem-sucedida.
          </AlertDescription>
        </Alert>

        {/* Environments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Ambientes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-amber-500" />
                  <CardTitle>Homologação</CardTitle>
                </div>
                <CardDescription>Ambiente de testes e desenvolvimento</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code="https://api-angar-homologacao.onrender.com"
                  language="url"
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Use este ambiente para desenvolver e testar sua integração antes de ir para produção.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-500" />
                  <CardTitle>Produção</CardTitle>
                </div>
                <CardDescription>Ambiente real para transações</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code="https://api-angar-producao.onrender.com"
                  language="url"
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Ambiente de produção para processar propostas reais de clientes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Flow */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Fluxo de Integração</h2>
          <p className="text-muted-foreground">
            A integração com a API Angar segue um fluxo simples de três etapas:
          </p>
          
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    1
                  </div>
                  <div>
                    <CardTitle>Autenticação</CardTitle>
                    <CardDescription>Obtenha um token de acesso JWT</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Faça uma requisição POST para <code className="bg-muted px-1.5 py-0.5 rounded">/v1/login</code> com suas credenciais para receber um token de acesso válido por 1 hora.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    2
                  </div>
                  <div>
                    <CardTitle>Envio de Proposta</CardTitle>
                    <CardDescription>Envie os dados da simulação do empréstimo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use o token para enviar uma proposta via POST para <code className="bg-muted px-1.5 py-0.5 rounded">/v1/propostas</code> com os dados do cliente e da simulação.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    3
                  </div>
                  <div>
                    <CardTitle>Recebimento de Webhook</CardTitle>
                    <CardDescription>Receba a resposta do cliente</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quando o cliente aceitar ou recusar a proposta, você receberá uma notificação POST na URL de webhook que você forneceu.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Próximos Passos</h2>
          <Card className="border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <CardTitle>Comece a Integração</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Agora que você entende o fluxo básico, vamos começar com a autenticação:
              </p>
              <Link href="/autenticacao">
                <div className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer">
                  <span className="font-medium">Ir para Autenticação</span>
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
