# 🤖 Chat Bot Multi-Modelos

Um chatbot avançado construído com NestJS que suporta múltiplos provedores de IA (OpenAI e Claude), permitindo conversas inteligentes com diferentes modelos de linguagem em uma única aplicação.

<img alt="NestJS" src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
<img alt="TypeScript" src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img alt="PostgreSQL" src="https://img.shields.io/badge/postgresql-336791?style=for-the-badge&logo=postgresql&logoColor=white">
<img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white">

## 🚀 Funcionalidades

✅ **Multi-Provedores**: Suporte para OpenAI e Claude Anthropic
✅ **Autenticação JWT**: Sistema de login seguro com tokens
✅ **Conversas Persistentes**: Histórico completo de mensagens
✅ **Múltiplos Modelos**: Escolha diferentes modelos por conversa
✅ **API RESTful**: Endpoints bem estruturados e documentados
✅ **Validação Robusta**: Validações em múltiplas camadas
✅ **Segurança Avançada**: Proteção de recursos por usuário
✅ **Arquitetura Escalável**: Padrões de design profissionais

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura modular baseada em padrões de design avançados:

- **Factory Pattern**: Gerenciamento dinâmico de provedores de IA
- **Strategy Pattern**: Implementações intercambiáveis de diferentes APIs
- **Repository Pattern**: Abstração da camada de dados
- **Guard Pattern**: Proteção de rotas com autenticação JWT

## 🛠️ Tecnologias

- **Framework**: NestJS 11.x
- **Linguagem**: TypeScript 5.x
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT + Bcrypt
- **Validação**: Class Validator
- **Provedores IA**: OpenAI SDK + Anthropic SDK
- **Linting**: ESLint + Prettier

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- PostgreSQL >= 12.0
- Conta OpenAI com API Key
- Conta Anthropic Claude com API Key

## ⚡ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/chat-bot-multi-modelos.git
cd chat-bot-multi-modelos
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

```bash
# Crie o banco PostgreSQL
createdb chatbot_db
```

### 4. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=chatbot_db

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-sua_openai_api_key

# Anthropic
ANTHROPIC_API_KEY=sk-ant-sua_anthropic_api_key

# App
PORT=3000
NODE_ENV=development
```

### 5. Execute a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A aplicação estará disponível em http://localhost:3000

## 🔗 Endpoints da API

### 🔐 Autenticação

```
POST /auth/
```

**Descrição**: Realiza login do usuário
**Body**:

```json
{
  "email": "usuario@email.com",
  "password": "MinhaSenh@123"
}
```

### 👥 Usuários

```
POST /users
```

**Descrição**: Registra novo usuário (público)
**Body**:

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "MinhaSenh@123"
}
```

```
PATCH /users
```

**Descrição**: Atualiza perfil do usuário

```
DELETE /users
```

**Descrição**: Remove conta do usuário

## 📁 Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── dto/             # DTOs de autenticação
│   ├── guards/          # Guards JWT
│   ├── hashing/         # Utilitários de hash
│   └── params/          # Parâmetros de autenticação
├── config/              # Configurações gerais
├── database/            # Configuração do banco
├── modules/             # Módulos da aplicação
│   ├── conversations/   # Módulo de conversas
│   │   └── dto/         # DTOs de conversa
│   ├── message/         # Módulo de mensagens
│   │   └── dto/         # DTOs de mensagem
│   ├── model-provider/  # Provedores de IA
│   │   ├── dto/         # DTOs do provedor
│   │   ├── enums/       # Enums de modelos
│   │   ├── factories/   # Factory Pattern
│   │   ├── providers/   # Implementações dos provedores
│   │   └── types/       # Tipos TypeScript
│   └── users/           # Módulo de usuários
│       └── dto/         # DTOs de usuário
├── app.module.ts        # Módulo principal
└── main.ts              # Ponto de entrada
```

### 💬 Conversas

```
POST /conversations
```

**Descrição**: Cria nova conversa
**Body**:

```json
{
  "title": "Conversa sobre IA", //Default: Nova conversa
  "model": "gpt-5-2025-08-07" //Default: gpt-5-nano-2025-08-07
}
```

```
GET /conversations?page=1&limit=10
```

**Descrição**: Lista conversas do usuário com paginação

```
PATCH /conversations/:id
```

**Descrição**: Atualiza título da conversa
**Body**:

```json
{
  "title": "Titulo atualizado"
}
```

```
DELETE /conversations/:id
```

**Descrição**: Remove conversa

### 📨 Mensagens

```
POST /message
```

**Descrição**: Envia mensagem e recebe resposta da IA
**Body**:

```json
{
  "content": "Explique o que é inteligência artificial",
  "role": "user",
  "conversationId": "id_da_conversa"
}
```

```
GET /message/:conversationId
```

**Descrição**: Lista mensagens de uma conversa

## 🤖 Modelos Suportados

### OpenAI

- **gpt-5** - O Melhor modelo para código e tarefas complexas.
- **gpt-5-mini** - Versão otimizada para tarefas rápidas e específicas.
- **gpt-5-nano** - Versão rápida e econômica.

### Anthropic Claude

- **Claude Opus 4** - Modelo mais inteligente e performático.
- **Claude Sonnet 4** - Modelo inteligente com performance equilibrada.
- **Claude Sonnet 3.7** - Modelo inteligente com função de pensamento, porém mais antigo.
- **Claude Haiku 3.5** - Modelo rápido e eficiente para tarefas específicas.
- **Claude Haiku 3.0** - Modelo básico para tarefas simples.

## 📁 Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── dto/             # DTOs de autenticação
│   ├── guards/          # Guards JWT
│   ├── hashing/         # Utilitários de hash
│   └── params/          # Parâmetros de autenticação
├── config/              # Configurações gerais
├── database/            # Configuração do banco
├── modules/             # Módulos da aplicação
│   ├── conversations/   # Módulo de conversas
│   │   └── dto/         # DTOs de conversa
│   ├── message/         # Módulo de mensagens
│   │   └── dto/         # DTOs de mensagem
│   ├── model-provider/  # Provedores de IA
│   │   ├── dto/         # DTOs do provedor
│   │   ├── enums/       # Enums de modelos
│   │   ├── factories/   # Factory Pattern
│   │   ├── providers/   # Implementações dos provedores
│   │   └── types/       # Tipos TypeScript
│   └── users/           # Módulo de usuários
│       └── dto/         # DTOs de usuário
├── app.module.ts        # Módulo principal
└── main.ts              # Ponto de entrada
```

## 🔒 Segurança

### Autenticação

- **JWT Tokens** com configuração robusta (issuer, audience, TTL)
- **Bcrypt** para hash de senhas com salt automático
- **Guards** para proteção de rotas sensíveis

### Validações

- **Senhas Fortes**: Mínimo 6 caracteres, maiúscula, minúscula, número e símbolo especial
- **Email Único**: Verificação de duplicidade
- **UUID Validation**: Validação de IDs com ParseUUIDPipe
- **Rate Limiting**: Proteção contra abuso de APIs

### Autorização

- **Resource Ownership**: Usuários só acessam seus próprios recursos
- **Token Validation**: Verificação de integridade e expiração
- **CORS Protection**: Configuração de origens permitidas

## 📊 Fluxo de Conversação

```
1. Usuário faz login → Recebe JWT Token
2. Cria nova conversa → Escolhe modelo de IA
3. Envia mensagem → Sistema processa com IA escolhida
4. Recebe resposta → Mensagem salva no histórico
5. Continua conversa → Contexto mantido
```

## 🎯 Exemplos de Uso

### Registro e Login

```bash
# Registrar usuário
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"MinhaSenh@123"}'

# Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"MinhaSenh@123"}'
```

### Criando Conversa e Enviando Mensagem

```bash
# Criar conversa
curl -X POST http://localhost:3000/conversations \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Conversa sobre IA","model":"gpt-4"}'

# Enviar mensagem
curl -X POST http://localhost:3000/conversations/CONVERSATION_ID/messages \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"O que é inteligência artificial?"}'
```

## 🧪 Scripts Disponíveis

```bash
npm run start          # Inicia em modo produção
npm run start:dev      # Inicia em modo desenvolvimento
npm run start:debug    # Inicia em modo debug
npm run build          # Compila o projeto
npm run test           # Executa testes unitários
npm run test:e2e       # Executa testes end-to-end
npm run test:cov       # Executa testes com cobertura
npm run lint           # Executa linting
npm run format         # Formata código
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Mantenha a cobertura de testes acima de 80%
- Documente novas APIs no README
- Use Conventional Commits para mensagens

## 📝 Roadmap

- [ ] **Implementação de testes** - Garantir qualidade e evitar regressões
- [ ] **Documentação com swagger** - Adicionar e configurar Swagger para documentação da API
- [ ] **WebSocket Support** - Chat em tempo real
- [ ] **Streaming Responses** - Respostas progressivas
- [ ] **File Upload** - Análise de documentos
- [ ] **Voice Chat** - Integração com APIs de voz
- [ ] **Plugin System** - Extensibilidade via plugins
- [ ] **Admin Dashboard** - Interface de administração
- [ ] **Rate Limiting** - Controle de uso por usuário
- [ ] **Monitoring** - Métricas e observabilidade

## 📚 Documentação Adicional

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference)

## 🐛 Problemas Conhecidos

- **Logs Estruturados**: Implementação básica - considere Winston ou Pino
- **Implementação de testes**: Ainda trabalhando nisso
- **Rate Limiting**: Não implementado - use com moderação em produção

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Seu Nome**

- LinkedIn: [Seu Perfil](https://www.linkedin.com/in/lucas-iniesta-simoes/)
- Email: l.iniesta.94@gmail.com

---

⭐ Se este projeto te ajudou, considera dar uma estrela no repositório!

**Feito com ❤️ e NestJS**

**Feito com ❤️ e NestJS**
