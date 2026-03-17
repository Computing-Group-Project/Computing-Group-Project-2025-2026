#!/usr/bin/env bash
# =============================================================================
# Demeter Database Backup Script
# NFR-Reliability: Automated backups every 5 minutes
#
# Usage:
#   ./scripts/backup.sh                    # One-time backup
#   ./scripts/backup.sh --install-cron     # Install 5-minute cron job
#   ./scripts/backup.sh --uninstall-cron   # Remove cron job
#
# Environment variables (with defaults):
#   DB_HOST          localhost
#   DB_PORT          3306
#   DB_NAME          demeter_db
#   DB_USER          root
#   DB_PASSWORD      (required - no default)
#   BACKUP_DIR       ./backups
#   BACKUP_RETAIN    288  (= 24 hours at 5-min intervals)
# =============================================================================

set -euo pipefail

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-demeter_db}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
BACKUP_DIR="${BACKUP_DIR:-$(dirname "$0")/../backups}"
BACKUP_RETAIN="${BACKUP_RETAIN:-288}"

SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
CRON_COMMENT="# demeter-db-backup"

# --- Functions ---

backup() {
    if [ -z "$DB_PASSWORD" ]; then
        echo "ERROR: DB_PASSWORD environment variable is required."
        echo "  export DB_PASSWORD='your_mysql_root_password'"
        exit 1
    fi

    mkdir -p "$BACKUP_DIR"

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="${BACKUP_DIR}/demeter_${TIMESTAMP}.sql.gz"

    echo "[$(date)] Starting backup of ${DB_NAME}..."

    mysqldump \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --user="$DB_USER" \
        --password="$DB_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --set-gtid-purged=OFF \
        "$DB_NAME" 2>/dev/null | gzip > "$BACKUP_FILE"

    FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] Backup complete: ${BACKUP_FILE} (${FILESIZE})"

    # Prune old backups beyond retention count
    BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}"/demeter_*.sql.gz 2>/dev/null | wc -l | tr -d ' ')
    if [ "$BACKUP_COUNT" -gt "$BACKUP_RETAIN" ]; then
        PRUNE_COUNT=$((BACKUP_COUNT - BACKUP_RETAIN))
        echo "[$(date)] Pruning ${PRUNE_COUNT} old backup(s) (retaining ${BACKUP_RETAIN})..."
        ls -1t "${BACKUP_DIR}"/demeter_*.sql.gz | tail -n "$PRUNE_COUNT" | xargs rm -f
    fi

    echo "[$(date)] Backups on disk: $(ls -1 "${BACKUP_DIR}"/demeter_*.sql.gz 2>/dev/null | wc -l | tr -d ' ')"
}

install_cron() {
    # Remove existing entry if present
    uninstall_cron 2>/dev/null || true

    CRON_LINE="*/5 * * * * DB_PASSWORD=\"\${DB_PASSWORD}\" ${SCRIPT_PATH} >> ${BACKUP_DIR}/backup.log 2>&1 ${CRON_COMMENT}"

    (crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -

    echo "Cron job installed: backup every 5 minutes."
    echo "Backups will be saved to: ${BACKUP_DIR}"
    echo "Logs will be written to: ${BACKUP_DIR}/backup.log"
    echo ""
    echo "IMPORTANT: Set DB_PASSWORD in your environment or edit the cron entry:"
    echo "  crontab -e"
    echo ""
    echo "To verify: crontab -l | grep demeter"
}

uninstall_cron() {
    crontab -l 2>/dev/null | grep -v "$CRON_COMMENT" | crontab -
    echo "Cron job removed."
}

restore() {
    local FILE="$1"
    if [ ! -f "$FILE" ]; then
        echo "ERROR: Backup file not found: $FILE"
        exit 1
    fi

    if [ -z "$DB_PASSWORD" ]; then
        echo "ERROR: DB_PASSWORD environment variable is required."
        exit 1
    fi

    echo "[$(date)] Restoring ${DB_NAME} from ${FILE}..."
    gunzip -c "$FILE" | mysql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --user="$DB_USER" \
        --password="$DB_PASSWORD" \
        "$DB_NAME"

    echo "[$(date)] Restore complete."
}

# --- Docker variant (for use within docker-compose) ---
docker_backup() {
    CONTAINER="${DOCKER_MYSQL_CONTAINER:-$(docker compose ps -q mysql 2>/dev/null || echo '')}"
    if [ -z "$CONTAINER" ]; then
        echo "ERROR: MySQL container not found. Is docker-compose running?"
        exit 1
    fi

    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="${BACKUP_DIR}/demeter_${TIMESTAMP}.sql.gz"

    echo "[$(date)] Starting Docker backup of ${DB_NAME}..."

    docker exec "$CONTAINER" mysqldump \
        --user="$DB_USER" \
        --password="$DB_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --set-gtid-purged=OFF \
        "$DB_NAME" 2>/dev/null | gzip > "$BACKUP_FILE"

    FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] Docker backup complete: ${BACKUP_FILE} (${FILESIZE})"
}

# --- Main ---
case "${1:-}" in
    --install-cron)
        install_cron
        ;;
    --uninstall-cron)
        uninstall_cron
        ;;
    --restore)
        if [ -z "${2:-}" ]; then
            echo "Usage: $0 --restore <backup-file.sql.gz>"
            exit 1
        fi
        restore "$2"
        ;;
    --docker)
        docker_backup
        ;;
    *)
        backup
        ;;
esac
