# IPSC

## ERD

- Relationship to Implement
  
![erd_diagram](./dbdiagram.io.png)

## Structure

```bash
├── client
│   ├── db.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── public
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   ├── designs
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   └── routes.jsx
├── dbdiagram.io.png
├── instance
├── migrations
├── README.md
├── requirements.txt
└── server
    ├── app.py
    ├── models
    │   ├── alert.py
    │   ├── dbconn.py
    │   ├── order.py
    │   ├── product.py
    │   ├── sale.py
    │   ├── supplier.py
    │   └── user.py
    └── routes
    └── seed.py
    └── services

```

## Setup

```bash
cd <your-repo>
pnpm install --prefix client
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

- No need to run ```flask db init``` already done for you

### Enviroment Variables

#### PostgreSQL Setup

**1. Install PostgreSQL**:  

- Follow the [DigitalOcean guide](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart) for Ubuntu, or use the appropriate installer for your OS.

**2. Start the PostgreSQL service** (if it's not running automatically):

```bash
   sudo systemctl start postgresql   # Linux
   # or
   brew services start postgresql    # macOS
```

**3. Create the database**

```bash
sudo -u postgres psql -c "CREATE DATABASE ipsc_db;"
```

**4. Ensure the database user and password**

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

**5. Add migration commands to create the tables**

- After setting up the database and installing dependencies, run the following to create all tables:

```bash
flask db upgrade
```

 **Note:** If your PostgreSQL runs on a non‑default port (like 5433), change the port number in the URI accordingly.

**To check the post go to within psql and paste the command 
below (simplest)**

```psql
SHOW port;
```

- **Create a .env with the following**

```env
FLASK_APP=server.app
FLASK_RUN_PORT=5020
FLASK_DEBUG=True
FLASK_SQLALCHEMY_DATABASE_URI=postgresql://postgres:postgres@localhost:5432/ipsc_db #for development
```
