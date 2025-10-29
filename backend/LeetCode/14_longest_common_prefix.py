# Write a function to find the longest common prefix string amongst an array of strings.

# If there is no common prefix, return an empty string "".


def longestCommonPrefix(strs):
    longest_prefix = ""
    for i, char in enumerate(strs[0]):
        for word in strs:
            if i == len(word) or word[i] != char:
                return longest_prefix
        longest_prefix += char


print(longestCommonPrefix(["flower", "flow", "flight"]))  # "fl"
print(longestCommonPrefix(["dog", "racecar", "car"]))  # ""
