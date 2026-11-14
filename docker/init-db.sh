#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER portfolio_user WITH ENCRYPTED PASSWORD '$PORTFOLIO_DB_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
    ALTER DATABASE portfolio OWNER TO portfolio_user;
    \c portfolio
    GRANT ALL ON SCHEMA public TO portfolio_user;
EOSQL