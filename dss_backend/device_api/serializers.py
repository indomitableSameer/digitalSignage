from rest_framework import serializers
from .models import DeviceRegistration

class DeviceRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceRegistration
        fields = ['device_id', 'created_at']