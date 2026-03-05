import DocsLayout from "@/components/DocsLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Rocket, Shield, Webhook } from "lucide-react";

export default function Changelog() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Notas de Versão</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Acompanhe as atualizações, melhorias e correções da API Parcred Brasil.
          </p>
        </div>

        {/* v1.1.0 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">v1.1.0</h2>
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Produção</Badge>
            <span className="text-sm text-muted-foreground">05 de Março de 2026</span>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Integração Oficial WhatsApp Business API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Lançamento oficial da integração com a Cloud API da Meta para envio de propostas via WhatsApp.
              </p>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Novidades:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    <strong>Envio via Template:</strong> Implementado suporte a templates pré-aprovados (Business Initiated) para garantir a entrega e conformidade com as políticas da Meta.
                  </li>
                  <li>
                    <strong>Parâmetros Dinâmicos:</strong> O template agora suporta injeção automática de Nome do Cliente, Valor Solicitado e Quantidade de Parcelas.
                  </li>
                  <li>
                    <strong>Webhook de Status:</strong> Endpoint <code>/v1/whatsapp/webhook</code> configurado para receber atualizações de status de entrega e respostas dos clientes.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Correções:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    <strong>Identificação WABA vs Phone ID:</strong> Corrigido o uso de IDs na API da Meta. Agora o sistema utiliza corretamente o <code>Phone Number ID</code> para envio de mensagens, resolvendo o erro <code>GraphMethodException 100/33</code>.
                  </li>
                  <li>
                    <strong>Validação de Webhook:</strong> Ajustada a lógica de verificação do token (<code>hub.verify_token</code>) para aceitar a chave de integração padrão.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* v1.0.0 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">v1.0.0</h2>
            <Badge variant="secondary">Lançamento Inicial</Badge>
            <span className="text-sm text-muted-foreground">01 de Março de 2026</span>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Lançamento da API Parcred Brasil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Primeira versão estável da API de Empréstimos Consignados.
              </p>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Funcionalidades:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    <strong>Autenticação JWT:</strong> Sistema seguro de autenticação via Client ID e Client Secret.
                  </li>
                  <li>
                    <strong>Gestão de Propostas:</strong> Endpoints para criação (<code>POST /v1/propostas</code>) e consulta de propostas.
                  </li>
                  <li>
                    <strong>Webhooks:</strong> Sistema de notificação passiva para atualização de status (Aceito/Recusado).
                  </li>
                  <li>
                    <strong>Ambientes Isolados:</strong> Separação completa entre Homologação e Produção.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DocsLayout>
  );
}
