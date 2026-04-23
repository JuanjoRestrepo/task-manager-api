#!/bin/bash

# Cargar variables de entorno si el archivo .env existe
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Verificar si DIRECT_URL está definida
if [ -z "$DIRECT_URL" ]; then
    echo "Error: DIRECT_URL no está definida en el archivo .env"
    exit 1
fi

# Nombre del archivo de backup con fecha
BACKUP_NAME="backup_$(date +%Y-%m-%d_%H-%M-%S).sql"
BACKUP_DIR="./backups"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

echo "Iniciando backup de la base de datos Neon..."
pg_dump "$DIRECT_URL" > "$BACKUP_DIR/$BACKUP_NAME"

if [ $? -eq 0 ]; then
    echo "✅ Backup completado con éxito: $BACKUP_DIR/$BACKUP_NAME"
else
    echo "❌ Error al realizar el backup"
    exit 1
fi
