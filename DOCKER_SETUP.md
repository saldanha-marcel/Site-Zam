# 🐳 Docker Compose - ZAM Site

Instruções para executar o projeto completo com Docker Compose.

## Pré-requisitos

- Docker instalado ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (incluído no Docker Desktop)

## Estrutura do Projeto

```
site-zam/
├── docker-compose.yml       # Orquestração dos serviços
├── .env                     # Variáveis de ambiente
├── .dockerignore            # Arquivos ignorados (frontend)
├── Dockerfile               # Build do frontend
├── package.json
├── src/                     # Código React
│
└── backend/
    ├── Dockerfile           # Build do backend
    ├── .dockerignore        # Arquivos ignorados (backend)
    ├── requirements.txt     # Dependências Python
    ├── main.py              # API FastAPI
    └── database.py          # Configuração do banco
```

## 🚀 Como Usar

### 1. Clonar o repositório (se aplicável)
```bash
cd site-zam
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env se necessário
```

### 3. Iniciar os serviços
```bash
docker-compose up -d
```

Isso vai iniciar:
- **PostgreSQL** (porta 5435)
- **Backend FastAPI** (porta 8000)
- **Frontend React** (porta 5173)

### 4. Acessar a aplicação

- **Frontend**: http://localhost:5173
- **Backend Docs**: http://localhost:8000/docs
- **Backend ReDoc**: http://localhost:8000/redoc

## 📝 Comandos Úteis

### Verificar status dos serviços
```bash
docker-compose ps
```

### Ver logs de um serviço
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Parar os serviços
```bash
docker-compose down
```

### Parar e remover volumes (limpar dados)
```bash
docker-compose down -v
```

### Reconstruir containers
```bash
docker-compose build --no-cache
```

### Executar comando no backend
```bash
docker-compose exec backend python -c "from database import Base; print('DB OK')"
```

## 🔧 Troubleshooting

### Porta já em uso
Se a porta já estiver em uso, edite o `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Mude para outra porta externa
```

### Banco de dados não conecta
Verifique as credenciais em `.env` e certifique-se que o serviço `db` está healthy:
```bash
docker-compose logs db
```

### Frontend não conecta ao backend
Verifique se `VITE_API_URL` está correto no `docker-compose.yml`

## 📦 Variáveis de Ambiente

Veja `.env.example` para todas as variáveis disponíveis:
- `DB_USER` - Usuário do PostgreSQL
- `DB_PASSWORD` - Senha do PostgreSQL
- `DB_NAME` - Nome do banco de dados
- `DB_PORT` - Porta do PostgreSQL

## 🛠️ Desenvolvimento

Para desenvolvimento com hot-reload:

```bash
# Backend
docker-compose run --rm backend uvicorn main:app --reload --host 0.0.0.0

# Frontend
docker-compose run --rm frontend npm run dev
```

## 📺 Monitoramento

Para um painel visual dos containers:
```bash
docker-compose logs -f
```

---

**Criado em:** 22 de março de 2026
