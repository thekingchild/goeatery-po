# GoEatery Landing Site Deployment

This folder is a static landing site. It must be served from the same public path used in the app setting.

## Recommended Laravel Setup

1. Copy this full folder into the Laravel public directory as:

   `public/home/`

2. Keep this exact structure:

   ```text
   public/home/index.html
   public/home/styles.css
   public/home/script.js
   public/home/assets/
   public/home/change-logs.html
   public/home/privacy.html
   public/home/terms.html
   public/home/.htaccess
   ```

3. In the GoEatery admin landing-site setting, use:

   `https://goeatery.ng/home/`

The trailing slash matters. Without it, browsers can resolve relative files like `styles.css` and `assets/...` against the domain root instead of `/home/`.

## If Serving From The Domain Root

If you copy these files directly into `public/` instead of `public/home/`, set the landing-site URL to:

`https://goeatery.ng/`

Do not point the setting to `https://goeatery.ng/home/` unless the files are actually inside `public/home/`.

## Nginx Example

If the Laravel server uses Nginx, make sure `/home/` is served as static files before requests fall through to Laravel:

```nginx
location = /home {
    return 301 /home/;
}

location ^~ /home/ {
    alias /path/to/laravel/public/home/;
    index index.html;
    try_files $uri $uri/ /home/index.html;
}
```

## Apache Notes

The included `.htaccess` is for the `public/home/` folder. Laravel's default public `.htaccess` should also keep the usual checks for existing files and directories:

```apache
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
```

Those checks let `/home/`, `/home/styles.css`, `/home/script.js`, and `/home/assets/...` load directly instead of being routed into Laravel.
