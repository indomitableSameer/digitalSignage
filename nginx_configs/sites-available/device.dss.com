server {
        listen 4001;
        listen [::]:4001;

        #root /var/www/web.dss.com;
        #index index.html;
}