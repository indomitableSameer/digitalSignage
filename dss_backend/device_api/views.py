from django.shortcuts import render
from rest_framework import generics
from .serializers import DeviceRegistrationSerializer
from .models import DeviceRegistration

# Create your views here.

class deviceRegistrationView(generics.CreateAPIView):
    
    query = DeviceRegistration.objects.all()
    serializer_class = DeviceRegistrationSerializer
    