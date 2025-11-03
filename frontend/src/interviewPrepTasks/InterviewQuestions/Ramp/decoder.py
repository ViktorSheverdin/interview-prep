import re
from bs4 import BeautifulSoup


def has_ref_class(class_string):
    # return True only if "ref" is present as a separate token
    if not class_string:
        return False
    # split on whitespace to treat class list properly
    return "ref" in class_string.split()


with open("ramp.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

url_chars = []

for section in soup.find_all("section"):
    data_id = section.get("data-id", "")
    if not data_id.startswith("92"):
        continue

    # find articles inside this section (preserves DOM order)
    for article in section.find_all("article"):
        data_class = article.get("data-class", "")
        if not data_class.endswith("45"):
            continue

        # find divs inside the article
        for div in article.find_all("div"):
            data_tag = div.get("data-tag", "")
            if "78" not in data_tag:
                continue

            # find the <b> element whose class list includes the token "ref"
            b = None
            for candidate in div.find_all("b"):
                if has_ref_class(
                    candidate.get("class")
                    and " ".join(candidate.get("class"))
                    or candidate.get("class")
                ):
                    b = candidate
                    break

            if b and b.get("value"):
                url_chars.append(b["value"])

hidden_url = "".join(url_chars)

print("Hidden URL:", hidden_url)
