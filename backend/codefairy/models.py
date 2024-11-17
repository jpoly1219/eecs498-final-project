from django.contrib.auth.models import AbstractUser
from django.db import models

class Problem(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    expert_solution = models.TextField()
    difficulty = models.CharField(max_length=50, choices=[("easy", "Easy"), ("medium", "Medium"), ("hard", "Hard")])
    created_at = models.DateTimeField(auto_now_add=True)

class Submission(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    code = models.TextField()
    result = models.JSONField(null=True, blank=True)  # Store results and feedback
    created_at = models.DateTimeField(auto_now_add=True)
    feedback = models.JSONField() # For storing when AI returns feedback
    failing_testcase = models.TextField()

#TestCase is associated with one problem
class TestCase(models.Model):
    problem = models.ForeignKey(Problem, related_name="test_cases", on_delete=models.CASCADE)
    input_data = models.TextField()
    expected_output = models.TextField()