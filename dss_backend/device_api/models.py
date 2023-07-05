from django.db import models

# Create your models here.
#class device_status(models.Model):
#    device_id = models.CharField(max_length=17, default="", unique=True)
#    last_update = models.DateTimeField(auto_now=False, auto_now_add=False)


#class device_content(models.Model):
#    test = models.CharField(max_length=10, default="")


class DeviceRegistration(models.Model):
    device_id = models.CharField(max_length=17, unique=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=False) 