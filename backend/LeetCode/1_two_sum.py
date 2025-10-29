# Given an array of integers nums and an integer target
# return indices of the two numbers such that they add up to target.

# You may assume that each input would have exactly one solution
# and you may not use the same element twice.

# You can return the answer in any order.


def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        number_for_sum = target - num
        if number_for_sum in num_map:
            return [num_map[number_for_sum], i]
        num_map[num] = i


print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))  # [1, 2]
print(two_sum([3, 3], 6))  # [0, 1]
