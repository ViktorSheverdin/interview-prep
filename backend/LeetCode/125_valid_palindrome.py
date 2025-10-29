# A phrase is a palindrome if, after converting all uppercase \
# letters into lowercase letters and removing all non-alphanumeric characters,
# it reads the same forward and backward. Alphanumeric characters include letters and numbers.

# Given a string s, return true if it is a palindrome, or false otherwise.
import re
def is_valid_palindrome(s):
    if (len(s) == 0):
        return True
    
    sanitized_s = re.sub(r'[^a-z0-9]', '', s.lower())
    left = 0
    right = len(sanitized_s) - 1
    while (left <= right):
        if (sanitized_s[left] != sanitized_s[right]):
            return False
        left += 1
        right -= 1
    return True
        
        

print(is_valid_palindrome('A man, a plan, a canal: Panama')) # true
print(is_valid_palindrome('abccba')) # true
print(is_valid_palindrome('abcdcba')) # true
print(is_valid_palindrome(' ')) # true
print(is_valid_palindrome('race a car')) # false
print(is_valid_palindrome('not a palindrome')) # false
