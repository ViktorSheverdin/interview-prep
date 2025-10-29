def longestPalindrome(s):

    longest = ""
    longestLen = 0
    for i in range(len(s)):
        # odd
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if (right - left + 1) > longestLen:
                longestLen = right - left + 1
                longest = s[left : right + 1]
            left -= 1
            right += 1

        # even
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if (right - left + 1) > longestLen:
                longestLen = right - left + 1
                longest = s[left : right + 1]
            left -= 1
            right += 1

    return longest


print(longestPalindrome("babad"))  # bab
print(longestPalindrome("cbbd"))  # bb
