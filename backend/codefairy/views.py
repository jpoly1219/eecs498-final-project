from django.shortcuts import render

def frontend(request):
    return render(request, 'base.html')

def index(request):
    return render(request, 'frontend/index.html')
