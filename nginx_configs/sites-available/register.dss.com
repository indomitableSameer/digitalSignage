server {
        listen 4000;
        listen [::]:4000;

        #root /var/www/web.dss.com;
        #index index.html;
}
