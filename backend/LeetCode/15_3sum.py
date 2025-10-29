# Given an integer array nums, return all the triplets
# [nums[i], nums[j], nums[k]] such that i != j, i != k,
# and j != k, and nums[i] + nums[j] + nums[k] == 0.

# Notice that the solution set must not contain duplicate triplets.


def three_sum(nums):
    pass


print(three_sum([-1, 0, 1, 2, -1, -4]))  # [[-1,-1,2],[-1,0,1]]
print(three_sum([0, 0, 0]))  # [[0, 0, 0]]
print(three_sum([0, 0, 0, 0]))  # [[0, 0, 0]]
print(three_sum([0, 1, 1]))  # []
