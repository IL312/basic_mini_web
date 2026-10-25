<#
.SYNOPSIS
    Запуск проекта в различных режимах.
.EXAMPLE
    .\run.ps1 dev
#>
param(
    [Parameter(Position = 0)]
    [ValidateSet('up', 'dev', 'rebuild', 'down', 'logs', 'status', 'local')]
    [string]$Mode = 'up'
)

# $ErrorActionPreference = 'Stop';
$Root = $PSScriptRoot;

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error 'Docker не найден в PATH. Установите Docker Desktop.';
    exit 1;
}

if (-not (Test-Path (Join-Path $Root '.env'))) {
    Write-Error 'Нет файла .env в корне. Выполните: cp .env.example .env и задайте пароль БД.';
    exit 1;
}

$devFiles = @('-f', 'docker-compose.yml', '-f', 'docker-compose.dev.yml');
$prodFiles = @('-f', 'docker-compose.yml', '-f', 'docker-compose.prod.yml');

switch ($Mode) {
    'up' {
        Write-Host '==> Prod-контур' -ForegroundColor Cyan;
        docker compose $prodFiles up -d --build;
    }
    'dev' {
        Write-Host '==> Dev-контур' -ForegroundColor Cyan;
        docker compose $devFiles up -d --build;
    }
    'rebuild' {
        Write-Warning 'Том БД будет удалён, все данные сбросятся к init-db.sql.';
        $answer = Read-Host 'Продолжить? (y/n)';
        if ($answer -ne 'y') { exit 0; }
        docker compose down -v;
        docker compose $prodFiles up -d --build;
    }
    'down' {
        $answer = Read-Host 'При остановке удалить образы и данные в этих контейнерах? (y/n)';
        if ($answer -eq 'y') { docker compose down --rmi local -v; }
        else { docker compose down; }
    }
    'logs' {
        docker compose logs -f;
    }
    'status' {
        docker compose ps;
    }
    'local' {
        $serverEnvPath = Join-Path (Join-Path $Root 'server') '.env';
        if (-not (Test-Path $serverEnvPath)) {
            Write-Error 'Нет server/.env. Выполните: cp server/.env.example server/.env';
            exit 1;
        }
        $clientEnvPath = Join-Path (Join-Path $Root 'client') '.env';
        if (-not (Test-Path $clientEnvPath)) {
            Write-Error 'Нет client/.env. Выполните: cp client/.env.example client/.env';
            exit 1;
        }
        Write-Host '==> Local-режим (DB на Docker)' -ForegroundColor Cyan;
        docker compose -f docker-compose.db.yml up -d;
        Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$Root\server'; npm run dev";
        Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$Root\client'; npm run dev";
        Write-Host 'Клиент: http://localhost:5173 (прокси /api на :5000)' -ForegroundColor Green;
    }
}

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE;
}