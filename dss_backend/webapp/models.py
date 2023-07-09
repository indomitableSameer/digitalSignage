from django.db import models

# Create your models here.
#class device_status(models.Model):
#    device_id = models.CharField(max_length=17, default="", unique=True)
#    last_update = models.DateTimeField(auto_now=False, auto_now_add=False)


#class device_content(models.Model):
#    test = models.CharField(max_length=10, default="")


class login(models.Model):
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20, unique=True) 