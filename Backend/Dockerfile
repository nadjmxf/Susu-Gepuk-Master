# ==========================================
# STAGE 1: Build Dependencies & Source Code
# ==========================================
FROM php:8.4-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    sed \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    icu-dev \
    postgresql-client

# Install PHP extension installer helper
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP extensions required by Laravel and PostgreSQL
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    opcache \
    zip \
    xml \
    bcmath \
    gd \
    intl

# Install Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Copy composer dependency files for caching
COPY composer.json composer.lock ./

# Install dependencies without dev requirements and autoloader dump
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application source code
COPY . .

# Copy Nginx, Supervisor, and Entrypoint configurations
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Make entrypoint script executable and fix line endings (CRLF to LF)
RUN chmod +x /usr/local/bin/entrypoint.sh && \
    sed -i 's/\r$//' /usr/local/bin/entrypoint.sh

# Run composer autoloader optimization
RUN composer dump-autoload --optimize --no-dev

# Setup log and run directories for supervisor
RUN mkdir -p /var/log/supervisor /var/run

# Set ownership and permissions for Laravel writable directories
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose standard port (will be overridden dynamically in Render)
EXPOSE 8080

# Configure entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
