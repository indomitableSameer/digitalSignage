server {
        listen 80;
        listen [::]:80;

        root /var/www/web.dss.com;
        index index.html;
}