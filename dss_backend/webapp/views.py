from django.shortcuts import render
from rest_framework import generics
from .serializers import loginSerializer
from .models import login

# Create your views here.

class loginView(generics.CreateAPIView):
    
    query = login.objects.all()
    serializer_class = loginSerializer
    