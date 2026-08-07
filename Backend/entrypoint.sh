#!/bin/sh
set -e

# Set default port if not provided by Render
if [ -z "$PORT" ]; then
    PORT=8080
fi

echo "Configuring Nginx to listen on port: $PORT"
sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/http.d/default.conf
sed -i "s/listen \[::\]:8080/listen \[::\]:$PORT/g" /etc/nginx/http.d/default.conf

# Bersihkan dan cache konfigurasi Laravel
echo "Caching Laravel configuration and routes..."
php artisan config:clear || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Jalankan migrasi database otomatis di production (jika diaktifkan)
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

echo "Starting Supervisor..."
exec supervisord -c /etc/supervisor/supervisord.conf
