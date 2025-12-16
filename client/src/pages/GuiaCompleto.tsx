import CodeBlock from "@/components/CodeBlock";
import DocsLayout from "@/components/DocsLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Book, CheckCircle } from "lucide-react";

export default function GuiaCompleto() {
  const step1Code = `TOKEN=$(curl -s -X POST https://api-parcred-homologacao.onrender.com/v1/login \\
  -H "Content-Type: application/json" \\
  -d '{"client_id":"parceiro_abc_123","client_secret":"dK$!s#@j9sA*d(s@D*j"}' \\
  | jq -r '.access_token')

echo "Token: $TOKEN"`;

  const step2Code = `WEBHOOK_URL="https://webhook.site/sua-url-unica"

RESPONSE=$(curl -s -X POST https://api-parcred-homologacao.onrender.com/v1/propostas \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d "{
    \\"id_proposta_parceiro\\":\\"TESTE-INTEGRACAO-001\\",
    \\"cliente\\":{
      \\"nome\\":\\"Cliente Teste\\",
      \\"cpf\\":\\"111.222.333-44\\",
      \\"whatsapp\\":\\"5511912345678\\"
    },
    \\"simulacao\\":{
      \\"valores\\":{
        \\"solicitado\\":1000,
        \\"iof\\":30,
        \\"principal\\":1030,
        \\"parcela\\":100,
        \\"liquido\\":1000,
        \\"bruto\\":2400
      },
      \\"taxas\\":{
        \\"cet_am\\":10,
        \\"cet_aa\\":200
      },
      \\"prazos\\":{
        \\"total_parcelas\\":24,
        \\"primeiro_vencimento\\":\\"2026-01-15\\",
        \\"ultimo_vencimento\\":\\"2027-12-15\\"
      }
    },
    \\"webhook_url\\":\\"$WEBHOOK_URL\\"
  }")

PROPOSTA_ID=$(echo "$RESPONSE" | jq -r '.id_proposta_angar')
echo "Proposta criada com ID: $PROPOSTA_ID"`;

  const step3Code = `curl "https://api-parcred-homologacao.onrender.com/confirmar/$PROPOSTA_ID?acao=aceitar"`;

  return (
    <DocsLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Book className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Guia Completo de Teste</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Siga este guia passo a passo para testar toda a integração no ambiente de homologação.
          </p>
        </div>

        {/* Prerequisites */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Pré-requisitos</h2>
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas Necessárias</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">curl</code> - Para fazer requisições HTTP</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">jq</code> - Para processar respostas JSON (opcional)</li>
                <li>Acesso ao <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">webhook.site</a> - Para testar webhooks</li>
              </ul>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Credenciais de Teste</AlertTitle>
            <AlertDescription>
              Para este guia, usaremos as credenciais de teste fornecidas. Em produção, você receberá suas próprias credenciais da equipe Parcred Brasil.
            </AlertDescription>
          </Alert>
        </div>

        {/* Step 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              1
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Obter Token de Acesso</h2>
          </div>
          
          <p className="text-muted-foreground">
            Primeiro, vamos autenticar e obter um token JWT válido:
          </p>

          <CodeBlock code={step1Code} language="bash" title="Passo 1: Autenticação" />

          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Resultado Esperado</AlertTitle>
            <AlertDescription>
              Você deve ver o token JWT impresso no terminal. Ele será usado automaticamente nas próximas requisições.
            </AlertDescription>
          </Alert>
        </div>

        {/* Step 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              2
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Criar uma Proposta</h2>
          </div>
          
          <p className="text-muted-foreground">
            Antes de executar este passo, acesse <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">webhook.site</a> e copie a URL única gerada. Substitua <code className="bg-muted px-1.5 py-0.5 rounded">sua-url-unica</code> no código abaixo:
          </p>

          <CodeBlock code={step2Code} language="bash" title="Passo 2: Criar Proposta" />

          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Resultado Esperado</AlertTitle>
            <AlertDescription>
              Você deve ver o ID da proposta criada (formato: ANG-xxxxx). Guarde este ID para o próximo passo.
            </AlertDescription>
          </Alert>
        </div>

        {/* Step 3 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              3
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Simular Aceite do Cliente</h2>
          </div>
          
          <p className="text-muted-foreground">
            Agora vamos simular o cliente aceitando a proposta. Você pode fazer isso via cURL ou acessando a URL diretamente no navegador:
          </p>

          <CodeBlock code={step3Code} language="bash" title="Passo 3: Simular Aceite" />

          <p className="text-muted-foreground">
            Ou acesse no navegador:
          </p>

          <CodeBlock
            code="https://api-parcred-homologacao.onrender.com/confirmar/[PROPOSTA_ID]?acao=aceitar"
            language="url"
          />

          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Resultado Esperado</AlertTitle>
            <AlertDescription>
              Você verá uma página HTML confirmando o aceite da proposta.
            </AlertDescription>
          </Alert>
        </div>

        {/* Step 4 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              4
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Verificar o Webhook</h2>
          </div>
          
          <p className="text-muted-foreground">
            Volte para a página do webhook.site que você abriu no Passo 2. Você deve ver uma nova requisição POST com:
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Dados Recebidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Headers</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><code className="bg-muted px-1.5 py-0.5 rounded">x-angar-signature</code> - Assinatura HMAC-SHA256</li>
                  <li><code className="bg-muted px-1.5 py-0.5 rounded">content-type: application/json</code></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Payload</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><code className="bg-muted px-1.5 py-0.5 rounded">id_proposta_angar</code> - ID da proposta Parcred Brasil</li>
                  <li><code className="bg-muted px-1.5 py-0.5 rounded">id_proposta_parceiro</code> - Seu ID (TESTE-INTEGRACAO-001)</li>
                  <li><code className="bg-muted px-1.5 py-0.5 rounded">status</code> - ACEITO</li>
                  <li><code className="bg-muted px-1.5 py-0.5 rounded">timestamp</code> - Data/hora do evento</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              Se você viu o webhook no webhook.site, sua integração está funcionando corretamente!
            </AlertDescription>
          </Alert>
        </div>

        {/* Testing Rejection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Testando Recusa</h2>
          <p className="text-muted-foreground">
            Para testar o fluxo de recusa, repita os passos 2 e 3, mas no Passo 3 use:
          </p>
          <CodeBlock
            code="https://api-parcred-homologacao.onrender.com/confirmar/[PROPOSTA_ID]?acao=recusar"
            language="url"
          />
          <p className="text-muted-foreground">
            O webhook receberá <code className="bg-muted px-1.5 py-0.5 rounded">status: "RECUSADO"</code> ao invés de "ACEITO".
          </p>
        </div>

        {/* Troubleshooting */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Solução de Problemas</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Problemas Comuns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Erro 401 (Unauthorized)</h4>
                <p className="text-sm text-muted-foreground">
                  Seu token expirou ou é inválido. Gere um novo token executando o Passo 1 novamente.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Erro 400 (Bad Request)</h4>
                <p className="text-sm text-muted-foreground">
                  Verifique se o JSON está corretamente formatado e se todos os campos obrigatórios estão presentes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Webhook não recebido</h4>
                <p className="text-sm text-muted-foreground">
                  Verifique se a URL do webhook.site está correta e se a página está aberta no navegador. O webhook.site só mostra requisições em tempo real.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Proposta não encontrada</h4>
                <p className="text-sm text-muted-foreground">
                  As propostas são armazenadas em memória no ambiente de homologação. Se o servidor for reiniciado, você precisará criar uma nova proposta.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Próximos Passos</h2>
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Implementar em Produção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Após validar a integração em homologação, você está pronto para implementar em produção:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Solicite suas credenciais de produção à equipe Parcred Brasil</li>
                <li>Implemente a validação de assinatura HMAC no seu webhook</li>
                <li>Altere a URL base para o ambiente de produção</li>
                <li>Configure monitoramento e logs</li>
                <li>Teste com transações reais em volume controlado</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Suporte</h2>
          <Card>
            <CardHeader>
              <CardTitle>Precisa de Ajuda?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Em caso de dúvidas ou problemas durante a integração, entre em contato com nossa equipe de suporte técnico:
              </p>
              <p className="mt-3">
                <a href="mailto:administrador.ti@parcredbrasil.com.br" className="text-primary hover:underline">
                  administrador.ti@parcredbrasil.com.br
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DocsLayout>
  );
}
