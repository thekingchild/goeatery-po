# GoEatery Landing Site Deployment

This folder is a static landing site. It must be served from the same public path used in the app setting.

## Recommended Laravel Setup

1. Copy this full folder into the Laravel public directory as:

   `public/home/`

2. Keep this exact structure:

   ```text
   public/home/index.html
   public/home/styles.css
   public/home/styles.20260628.css
   public/home/script.js
   public/home/script.20260628.js
   public/home/assets/
   public/home/change-logs.html
   public/home/privacy.html
   public/home/terms.html
   public/home/.htaccess
   ```

3. In the GoEatery admin landing-site setting, use:

   `https://goeatery.ng/home/`

Do not include `public` in the URL. `public` is the server folder/document root, not part of the website address.

The trailing slash matters. Without it, browsers can resolve relative files like `styles.20260628.css` and `assets/...` against the domain root instead of `/home/`.

After uploading a new version, purge the CDN/cache for `/home/*` if Cloudflare or another cache sits in front of the site. This bundle also uses versioned CSS and JS filenames so fresh deployments do not reuse an older cached `styles.css`.

## Root Proxy Setup

This bundle is safe to serve at `https://goeatery.ng/` while the files remain inside `public/home/`. Browser-facing asset links use `/home/...`, so a root proxy can load `public/home/index.html` without making the browser request missing files like `/styles.css` or `/assets/...`.

For this setup:

- Keep the files in `public/home/`.
- Make `https://goeatery.ng/` serve or proxy `public/home/index.html`.
- Keep `/home/*` publicly reachable for CSS, JS, images, and supporting pages.
- Use the landing-site URL `https://goeatery.ng/` if the app setting should show the homepage at the root.

## If Serving From The Domain Root

If you copy these files directly into `public/` instead of `public/home/`, set the landing-site URL to:

`https://goeatery.ng/`

Do not point the setting to `https://goeatery.ng/home/` unless the files are actually inside `public/home/`.

## Nginx Example

If the Laravel server uses Nginx, make sure `/home/` is served as static files before requests fall through to Laravel:

```nginx
location = / {
    try_files /home/index.html =404;
}

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

Those checks let `/home/`, `/home/styles.20260628.css`, `/home/script.20260628.js`, and `/home/assets/...` load directly instead of being routed into Laravel.
