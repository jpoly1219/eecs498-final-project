from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Problem
from .models import Submission
from .models import TestCase


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'problem', 'code', 'feedback', 'created_at']


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'