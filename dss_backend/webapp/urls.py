from django.urls import include, path
from .views import loginView

urlpatterns = [
    path('login', loginView.as_view())
]
        