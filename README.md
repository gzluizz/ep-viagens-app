# EP Viagens Monorepo

Este workspace foi organizado em duas pastas principais:

- **backend/** – aplicação Django com toda lógica e API REST.
- **client/** – ponto de partida para o front-end React (ainda a ser gerado).

A virtualenv `.venv` permanece no nível raiz para ser usada por ambos os lados.

### Como trabalhar

#### Backend
```bash
cd backend
..\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py runserver
```

#### Frontend (React)
```bash
cd client
# após instalar Node.js e inicializar com CRA ou Vite
```

Ambos os códigos podem ser versionados independentemente dentro do mesmo repositório.
