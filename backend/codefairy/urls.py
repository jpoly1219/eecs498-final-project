from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter
from .views import ProblemViewSet, SubmissionView, TestCase, ProblemDetailView

router = DefaultRouter()
router.register(r'problems', ProblemViewSet)  # Register Problem endpoints
router.register(r'test_cases', TestCase)


urlpatterns = [
    path('', include(router.urls)),
    path('submissions/', SubmissionView.as_view(), name='submission'),
     path('api/problem/', ProblemDetailView.as_view(), name='problem-detail'),
]

