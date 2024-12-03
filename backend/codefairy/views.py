from .models import Problem
from openai import OpenAI

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
import json


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


# APIView to handle retrieving problem info on initial page load

# API view to retrieve problem details

class ProblemDetailView(APIView):
    def get(self, request):
        try:
            # Hardcoded to fetch problem with id = 1
            problem = Problem.objects.get(id=1)
            return Response({
                "id": problem.id,
                "title": problem.title,
                "description": problem.description
            }, status=status.HTTP_200_OK)
        except Problem.DoesNotExist:
            return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)


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
            print("OUTPUT:", output)

            if output["status"] == "success":
                if output["output"] == expected_output:
                    # Check if the user's code is actually dp.
                    prompt = create_prompt(
                        user_code, test_input, output["output"], expected_output, "Pass")

                    ai_feedback, ai_error_lines = [
                        (json.loads(call_openai(prompt)))[key]
                        for key in ["feedback", "error_lines"]
                    ]

                    feedback.append({
                        "input": test_input,
                        "output": output["output"],
                        "expected": expected_output,
                        "result": "Pass",
                        "ai_feedback": ai_feedback,
                        "ai_error_lines": ai_error_lines
                    })
                    break
                else:
                    prompt = create_prompt(
                        user_code, test_input, output["output"], expected_output, "Fail")

                    ai_feedback, ai_error_lines = [
                        (json.loads(call_openai(prompt)))[key]
                        for key in ["feedback", "error_lines"]

                    ]
                    feedback.append({
                        "input": test_input,
                        "output": output["output"],
                        "expected": expected_output,
                        "result": "Fail",
                        "ai_feedback": ai_feedback,
                        "ai_error_lines": ai_error_lines
                    })
                    break
            else:
                prompt = create_prompt(
                    user_code, test_input, output["error"], expected_output, "Error")

                ai_feedback, ai_error_lines = [
                    (json.loads(call_openai(prompt)))[key]
                    for key in ["feedback", "error_lines"]
                ]

                feedback.append({
                    "input": test_input,
                    "error": output["error"],
                    "result": "Error",
                    "ai_feedback": ai_feedback,
                    "ai_error_lines": ai_error_lines
                })
                break

        print(feedback)
        submission_data = {
            "problem": problem.id,
            "code": user_code,
            # Join feedback messages into a single string
            "feedback": feedback,
        }

        serializer = SubmissionSerializer(data=submission_data)

        if serializer.is_valid():
            serializer.save()
            return Response({"feedback": serializer.data["feedback"]}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def execute_user_code(user_code, test_input):
    try:
        # try:
        #     compile(user_code, '<string>', 'exec')
        # except SyntaxError as e:
        #     return {"status": "error", "error": str(e)}

        # Create a temporary Python file for the user's code
        with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as temp_file:
            script = "\n".join([
                user_code,
                "",
                'if __name__ == "__main__":',
                "    try:",
                "        sol = Solution()",
                f"        print(sol.climbStairs({test_input}))",
                "    except Exception as e:",
                '        print(f"{str(e)}")',
                "        exit(1)"
            ])
            print(script)
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
        print(result)

        if result.returncode == 0:
            return {"status": "success", "output": result.stdout.strip()}
        else:
            return {"status": "error", "error": result.stdout.strip()}

    except subprocess.TimeoutExpired:
        return {"status": "error", "error": "Code execution timed out"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def create_prompt(user_code, test_input, user_output, expected_output, result):
    # NOTE: Result could be an enum instead of a string.
    description_body = "\n".join([
        "**Description**",
        "",
        "Your student's code has no errors.",
        "",
        "However, check your student's code and see if he is using dynamic programming.",
    ]) if result == "Pass" else "\n".join([
        "**Description**",
        "",
        f"Your student's code had the following error on test case `{
            test_input}`:",
        "",
        f"This was his result: `{user_output}`.",
        "",
        f"This was the expected result: `{expected_output}`.",
    ])

    prompt = "\n".join([
        "You are a helpful tutor at a university who is trying to teach your student how to solve a dynamic programming problem.",
        "I will give you the following list of items: LeetCode Question Body, Student code, Description, Expert code, Expert step-by-step solution, and my request.",
        "Each item in this list will be separated by the following divider: ##########",
        "",
        "##########",
        "",
        "**LeetCode Question Body**",
        "",
        "You are climbing a staircase. It takes n steps to reach the top.",
        "",
        "Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        "",
        "Example 1:",
        "",
        "Input: n = 2",
        "Output: 2",
        "Explanation: There are two ways to climb to the top.",
        "1. 1 step + 1 step",
        "2. 2 steps",
        "Example 2:",
        "",
        "Input: n = 3",
        "Output: 3",
        "Explanation: There are three ways to climb to the top.",
        "1. 1 step + 1 step + 1 step",
        "2. 1 step + 2 steps",
        "3. 2 steps + 1 step",
        " ",
        "Constraints:",
        "1 <= n <= 45",
        "",
        "##########",
        "",
        "**Student code**",
        "",
        "The following was your student's answer to the previous code.",
        "",
        "```py",
        user_code,
        "```",
        "",
        "##########",
        "",
        description_body,
        "",
        "##########",
        "",
        "**Expert code**",
        "",
        "This is the expert solution to the LeetCode problem stated above:",
        "",
        "```py",
        "class Solution:",
        "    def climbStairs(self, n: int) -> int:",
        "        if n == 0 or n == 1:",
        "            return 1",
        "        prev, curr = 1, 1",
        "        for i in range(2, n+1):",
        "            temp = curr",
        "            curr = prev + curr",
        "            prev = temp",
        "        return curr",
        "```",
        "",
        "##########",
        "",
        "**Expert step-by-step solution**",
        "",
        "This is the expert's thought process when solving a dynamic programming problem:",
        "",
        "1. Determine the constraints.",
        "2. Find the recursive pattern.",
        "3. Create a memo to store previous calculations.",
        "4. Handle the base cases.",
        "5. Write the inductive step in terms of previous steps. When doing this, use the pre-computed values in the memo instead of recursively calling the function.",
        "",
        "##########",
        ""
        "Given the above list, your task is to figure out what part of the expert step your student is missing, and what line numbers in his code is errorneous.",
        "",
        "Check the failing test case and figure out what part of your student's code is resonsible.",
        "",
        "Compare your student's code to the expert code and the expert step-by-step solution to find what step he is missing.",
        "",
        "Your response should be a JSON with the following fields and types:",
        "```ts",
        "{",
        "    'feedback': string,",
        "    'error_lines': number[]",
        "}",
        "```",
        "",
        f"The `error_lines` field should be a list of line numbers where the error happened. The error cannot occur in the first two lines, so do not include those as an option. Where the error happened depends on what step your student's code is missing, and your student's output {user_output} for an input {test_input}, whereas the expected output is {
            expected_output}. For example, if your student is missing step 3, then you should only extract lines responsible for the missing step. Lines are represented by the newline character, and each newline character adds a new line. Which means that if there are no newline characters, there is only one line, line number 1. Line numbres are 1-indexed. For example, if lines 6 through 10 in your student's code is causing an error, the value of the field should be `[6, 7, 8, 9, 10]`. For another example, if line 2 is causing an error, the value of the field should be `[2]`. If your student's code is correct and uses dynamic programming solution, this should be an empty list. The lines you say here must correspond to the lines in the `feedback` field. DO NOT include lines that are unrelated. DO NOT include anything else.",
        "",
        "The `feedback` field should include what step in the expert step-by-step solution your student's code is missing, and a short feedback on how your student can improve their code. You should say in your response what lines are responsible for the missing step, and say why. The lines you say here must correspond to the lines in the `error_lines` field. Your student's code can be missing multiple steps, one step, or no steps. If your student's code is a correct dynamic programing solution, reply with 'Awesome work! Your code is correct.'. DO NOT include anything else in this field. If your student's code has a syntax error, just say that the code has a syntax error.",
        "",
        "Before creating a response, you should go through your student's code line by line to determine what each line is doing. When you are giving feedback, make sure you consult this analysis. Sometimes you make the mistake of describing the correct error for the wrong line. DO NOT add this to your response.",
        "",
        "ONLY return the JSON object as a response. DO NOT return anything else. DO NOT include the markdown code block such as ```json and ```.",
        "",
        "In your feedback, please address the student as if you are having a conversation with him."
    ])

    return prompt


def call_openai(prompt):
    client = OpenAI(
        api_key="<YOUR KEY HERE>"
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="gpt-4o",
    )

    return (chat_completion.choices[0].message.content)
