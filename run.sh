#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

MODE="${1:-up}"

command -v docker >/dev/null 2>&1 || { echo 'Docker не найден в PATH'; exit 1; }
[ -f .env ] || { echo 'Нет .env в корне: cp .env.example .env'; exit 1; }

DEV_FILES="-f docker-compose.yml -f docker-compose.dev.yml"
PROD_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

case "$MODE" in
  up)
    echo '==> Prod-контур'
    docker compose $PROD_FILES up -d --build
    ;;
  dev)
    echo '==> Dev-контур'
    docker compose $DEV_FILES up -d --build
    ;;
  rebuild)
    read -r -p 'Том БД будет удалён, все данные сбросятся к init-db.sql. Продолжить? (y/n) ' answer
    [ "$answer" = 'y' ] || exit 0
    docker compose down -v
    docker compose $PROD_FILES up -d --build
    ;;
  down)
    read -r -p 'При остановке удалить образы и данные в этих контейнерах? (y/n) ' answer
    if [ "$answer" = 'y' ]; then
      docker compose down --rmi local -v
    else
      docker compose down
    fi
    ;;
  logs)
    docker compose logs -f
    ;;
  status)
    docker compose ps
    ;;
  local)
    [ -f server/.env ] || { echo 'Нет server/.env: cp server/.env.example server/.env'; exit 1; }
    [ -f client/.env ] || { echo 'Нет client/.env: cp client/.env.example client/.env'; exit 1; }
    echo '==> Local-режим (DB на Docker)'
    docker compose -f docker-compose.db.yml up -d

    (cd server && npm run dev) &
    (cd client && npm run dev) &

    echo 'Сервер: http://localhost:5000'
    echo 'Клиент: http://localhost:5173 (прокси /api на :5000)'
    wait
    ;;
  *)
    echo "Неизвестный режим: $MODE"
    echo 'Режимы: up | dev | rebuild | down | logs | status | local'
    exit 1
    ;;
esac