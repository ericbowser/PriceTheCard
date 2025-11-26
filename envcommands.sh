#!/bin/bash
# config-cli.sh
#DB_URL="${ericbo://ericbo:1006@localhost:5432/localhost}"
#DB_URL="${DATABASE_URL:-postgresql://ericbo:1006@localhost/configs}"
DB_HOST="${DB_HOST:-localhost}"
DB_NAME="${DB_NAME:-postgres}"
DB_USER="${DB_USER:-ericbo}"
DB_PASS="${DB_PASS:-1006}"


COMMAND=$1
PROJECT=$2
ENV=$3

push() {
  CONTENT=$(<"env.json")
  
  PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c \
    "INSERT INTO dotenv.configs (project, environment, data, updatedat) VALUES ('$PROJECT', '$ENV', '$CONTENT'::jsonb, NOW())"
  
  echo "Pushed $ENV config for $PROJECT from env.json"
}

pull() {
  PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -t -A -c \
    "SELECT data FROM dotenv.configs WHERE project='$PROJECT' AND environment='$ENV' ORDER BY updatedat DESC LIMIT 1" \
    > "env.json"
  
  echo "Pulled $ENV config for $PROJECT to env.json"
}

case "$COMMAND" in
  push) push ;;
  pull) pull ;;
  *) echo "Usage: config-cli [push|pull] <project> <environment>" ;;
esac