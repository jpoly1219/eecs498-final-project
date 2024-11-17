# eecs498-final-project

## Prompt engineering

The prompt should have the following:
- LeetCode question body
- Student code
- First failed test case | compiler error | runtime error
- Expert code
- Expert step-by-step solution
- NL request body

This is a function of (product of the above six) -> (erroneous lines, feedback).

### Notes from Nov 14 2024

It seems like the prompt works decently well.

What works:
- Deterministically returns a JSON that we can parse directly.
- Feedback seems pretty accurate.

What doesn't work:
- The line numbers seem to be nondeterministic. Sometimes it will be correct, sometimes it will be off.
  - Maybe a chain of thought prompting can fix this.

## Prompt body

I will give you the following list of items: LeetCode Question Body, Student code, Error body, Expert code, Expert step-by-step solution, and my request.
Each item in this list will be separated by the following divider: ##########

##########

**LeetCode Question Body**

You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example 1:

Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
Example 2:

Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
 
Constraints:
1 <= n <= 45

##########

**Student code**

The following was the student's answer to the previous code.

```py
class Solution:
    def climbStairs(self, n: int) -> int:
        if n == 0 or n == 1:
            return 1
        return self.climbStairs(n-1) + self.climbStairs(n-2)
```

##########

**Error body**

<!-- if the student's code had a compile error -->

The student's code had the following static error:

```text
<add compiler error here>
```

<!-- if the student's code had a runtime error -->

The student's code had the following runtime error on test case `<add test case input here>`:

```text
<add runtime error here>
```

<!-- if the student's code had a test case error -->

The student's code had the following error on test case `3`:

This was the student's result: `1`.

This was the expected result: `3`.

##########

**Expert code**

This is the expert solution to the LeetCode problem stated above:

```py
class Solution:
    def climbStairs(self, n: int) -> int:
        if n == 0 or n == 1:
            return 1
        prev, curr = 1, 1
        for i in range(2, n+1):
            temp = curr
            curr = prev + curr
            prev = temp
        return curr
```

##########

**Expert step-by-step solution**

This is the expert's thought process when solving a dynamic programming problem:

1. Determine the constraints.
2. Find the recursive pattern.
3. Create a memo to store previous calculations.
4. Handle the base cases.
5. Write the inductive step in terms of previous steps. When doing this, use the pre-computed values in the memo instead of recursively calling the function.

##########

Given the above list, your task is to figure out what part of the expert step the student is missing, and what line numbers in the student's code is errorneous.

Check the failing test case and figure out what part of the student's code is resonsible.

Compare the student code to the expert code and the expert step-by-step solution to find what step the student is missing.

Your response should be a JSON with the following fields and types:
```ts
{
    "feedback": string,
    "error_lines": number[]
}
```

The `feedback` field should include what step in the expert step-by-step solution the student code is missing, and a short feedback on how the student can improve their code. If the student's code is correct and uses dynamic programing, reply with 'Awesome work! Your code is correct.'. DO NOT include anything else in this field.

The `error_lines` field should be a list of line numbers where the error happened. Lines are represented by the newline character, and each newline character adds a new line. Which means that if there are no newline characters, there is only one line, line number 1. Line numbres are 1-indexed. For example, if lines 6 through 10 in the student's code is causing an error, the value of the field should be `[6, 7, 8, 9, 10]`. For another example, if line 2 is causing an error, the value of the field should be `[2]`. If the student's code is correct and uses dynamic programming solution, this should be an empty list. DO NOT include anything else.

ONLY return the JSON object as a response. DO NOT return anything else. DO NOT include the markdown code block such as ```json and ```.
