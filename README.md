# Portal de Documentação — Angar API

Portal interativo de documentação para integração com a API de Empréstimos Angar. Inclui guias, exemplos de código, referência completa da API e playground para testes.

## Stack

- **Frontend:** React 19 + Vite 7 + TypeScript
- **Estilo:** Tailwind CSS v4 + shadcn/ui
- **Roteamento:** Wouter
- **Backend:** Express (serve o build estático)
- **Package manager:** pnpm

## Páginas

| Rota | Descrição |
|---|---|
| `/` | Introdução |
| `/autenticacao` | Autenticação OAuth |
| `/propostas` | Referência de Propostas |
| `/webhooks` | Referência de Webhooks |
| `/guia-completo` | Guia de integração completo |
| `/playground` | Teste interativo dos endpoints |
| `/status` | Status dos ambientes |
| `/changelog` | Histórico de mudanças |
| `/whatsapp-sender` | Envio via WhatsApp |

## Desenvolvimento local

```bash
# Instalar dependências
pnpm install

# Criar arquivo de variáveis de ambiente
cp .env.example .env

# Iniciar em modo dev
pnpm run dev
```

Acesse em `http://localhost:3000`.

## Variáveis de ambiente

Veja `.env.example` para a lista completa. No Railway, configure via **Variables** no painel do serviço.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_OAUTH_PORTAL_URL` | Sim (build) | URL base do portal OAuth |
| `VITE_APP_ID` | Sim (build) | ID da aplicação OAuth |
| `PORT` | Não | Railway injeta automaticamente |

## Deploy no Railway

### Primeira vez

1. No [Railway](https://railway.app), crie um novo projeto → **Deploy from GitHub repo**
2. Selecione `rigossi/portal-docs-angar`
3. Em **Variables**, adicione:
   - `VITE_OAUTH_PORTAL_URL` = valor real ou `https://placeholder.example.com`
   - `VITE_APP_ID` = valor real ou `placeholder`
4. Railway detecta o `railway.json` automaticamente e faz o build

### Domínio customizado

Em **Settings → Networking**, gere um domínio Railway (`*.up.railway.app`) ou configure um domínio próprio via CNAME.

### Comandos

```bash
# Build de produção
pnpm run build

# Iniciar servidor de produção
pnpm run start
```

O build gera `dist/public/` (assets estáticos). O Express serve esses arquivos e faz fallback para `index.html` em todas as rotas (SPA routing).
