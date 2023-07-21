from django.urls import include, path
from .views import deviceRegistrationView

urlpatterns = [
    path('register', deviceRegistrationView.as_view())
]