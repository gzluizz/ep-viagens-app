# EP Viagens - Backend API

Sistema de gerenciamento de viagens para agência de turismo.

## 📋 Requisitos

- Python 3.13+
- PostgreSQL (via Supabase)

## 🚀 Instalação

O código backend agora está dentro da pasta `backend`.

1. **Clone ou acesse o projeto:**
   ```bash
   cd f:\Desenvolvimento\ep_viagens_App\backend
   ```

2. **Ative o ambiente virtual (raiz do workspace):**
   ```bash
<<<<<<< HEAD
   # Linux / macOS (bash)
   python3 -m venv .venv
   source .venv/bin/activate

   # Windows PowerShell
   # ..\.venv\Scripts\Activate.ps1
=======
   ..\.venv\Scripts\Activate.ps1
>>>>>>> 8caa7cd (Initial commit: Full project structure)
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure o arquivo `.env` com suas credenciais** (já está dentro de `backend`).

<<<<<<< HEAD
   Observação: o projeto carrega automaticamente `backend/.env` em desenvolvimento
   (via `python-dotenv`) — não é necessário `source .env`. Apenas mantenha o
   arquivo `.env` em `backend/` e não o comite no repositório.

=======
>>>>>>> 8caa7cd (Initial commit: Full project structure)
5. **Rode as migrações:**
   ```bash
   python manage.py migrate
   ```

6. **Inicie o servidor:**
   ```bash
   python manage.py runserver
   ```

<<<<<<< HEAD
### Exemplo rápido (Linux / macOS)

```bash
# a partir do diretório `backend`
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# preencha backend/.env com suas credenciais
python manage.py migrate
python manage.py runserver
```

=======
>>>>>>> 8caa7cd (Initial commit: Full project structure)
## 📊 Modelos de Dados

- **Destino** - Cidades/países de viagens
- **Hospedagem** - Hotéis e pousadas
- **Transporte** - Meios de transporte
- **Viajante** - Clientes/passageiros
- **Viagem** - Viagens planejadas
- **ViagemViajante** - Relacionamento (M2M) entre viagens e viajantes

## 👨‍💼 Admin Panel

Acesse em `http://localhost:8000/admin/`

**Credenciais:**
- Username: `admin`
- Password: (configure na primeira vez)

## 📦 API Endpoints (em desenvolvimento)

Será implementado via Django REST Framework para:
- Listar/criar/editar/deletar viagens
- Gerenciar viajantes
- Controlar pagamentos

## 🔒 Segurança

- As credenciais estão no arquivo `.env` (não commitar para Git!)
- Implemente autenticação token para as proprietárias
- Use HTTPS em produção

## 📝 Próximos Passos

- [ ] Implementar API REST (Django REST Framework)
- [ ] Autenticação com JWT
- [ ] Validações e regras de negócio
- [ ] Testes unitários
- [ ] Deploy em produção
