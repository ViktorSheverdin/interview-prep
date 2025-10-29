def removeDuplicates(nums):
    if not nums:
        return 0

    i = 0
    for j in range(1, len(nums)):
        if nums[i] != nums[j]:
            i += 1
            nums[i] = nums[j]
    return i + 1


print(removeDuplicates([1, 1, 2]))  # 2
print(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]))  # 5
