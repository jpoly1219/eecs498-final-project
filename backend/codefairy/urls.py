from django.contrib import admin
from django.urls import path
from . import views  # Import views from your Django app
from django.conf.urls import include

urlpatterns = [
    path('', views.frontend, name='frontend'),
    path('admin/', admin.site.urls),
    path('api-auth', include('rest_framework.urls')),
    path('', views.index, name='index'),  # Add this line to point to your frontend

]



    
