from rest_framework import viewsets
from .models import Problem, Submission, TestCase
from .serializer import ProblemSerializer
from .serializer import SubmissionSerializer
from .serializer import TestCaseSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import subprocess
import tempfile
import os

class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer

class TestCase(viewsets.ModelViewSet):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer

# {
#     "problem": 1,
#     "code": "def climbStairs(n): return n * 2"
# }

# How returned feedback would look like
        
# {
#     "feedback": [
#         {
#             "input": "2",
#             "output": "4",
#             "expected": "4",
#             "result": "Pass"
#         },
#         {
#             "input": "3",
#             "output": "6",
#             "expected": "7",
#             "result": "Fail"
#         },
#         {
#             "input": "5",
#             "error": "NameError: name 'DP' is not defined",
#             "result": "Error"
#         }
#     ]
# }

class SubmissionView(APIView):
    def post(self, request):
        
        problem_id = request.data.get('problem')
        user_code = request.data.get('code')

        if not problem_id or not user_code:
            return Response({"error": "problem and code are required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            problem = Problem.objects.get(id=problem_id)
            test_cases = problem.test_cases.all()
        except Problem.DoesNotExist:
            return Response({"error": "Problem does not exist"}, status=status.HTTP_404_NOT_FOUND)

        feedback = []

        for test_case in test_cases:
            test_input = test_case.input_data
            expected_output = test_case.expected_output
            output = execute_user_code(user_code, test_input)
            
            if output["status"] == "success":
                if output["output"] == expected_output:
                    feedback.append({
                        "input": test_input,
                        "output": output["output"],
                        "expected": expected_output,
                        "result": "Pass" 
                    })
                else:
                    feedback.append({
                        "input": test_input,
                        "output": output["output"],
                        "expected": expected_output,
                        "result": "Fail"
                    })
            else:
                feedback.append({
                    "input": test_input,
                    "error": output["error"],
                    "result": "Error"
                })

        submission_data = {
            "problem": problem.id,
            "code": user_code,
            "feedback": feedback,  # Join feedback messages into a single string
        }

        serializer = SubmissionSerializer(data=submission_data)

        if serializer.is_valid():
            serializer.save()
            return Response({"feedback": serializer.data["feedback"]}, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def execute_user_code(user_code, test_input):

    try:
        # Create a temporary Python file for the user's code
        with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as temp_file:
            script = f"""
{user_code}

if __name__ == "__main__":
    try:
        print(DP({test_input}))
    except Exception as e:
        print(f"Error: {{e}}")
"""
            temp_file.write((script).encode('utf-8'))
            temp_file_path = temp_file.name

        # Execute the code and capture output
        result = subprocess.run(
            ["python3", temp_file_path],
            capture_output=True,
            text=True,
            timeout=5  # Timeout to prevent long execution
        )

        os.remove(temp_file_path)

        if result.returncode == 0:
            return {"status": "success", "output": result.stdout.strip()}
        else:
            return {"status": "error", "error": result.stderr.strip()}

    except subprocess.TimeoutExpired:
        return {"status": "error", "error": "Code execution timed out"}
    except Exception as e:
        return {"status": "error", "error": str(e)}
