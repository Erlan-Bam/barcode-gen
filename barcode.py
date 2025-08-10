# coding: utf-8
import sys
import re
from functools import partial
from libs.pdf417 import encode, render_image, render_svg

data = (
    sys.argv[1]
    .replace("␊", "\n", 150)
    .replace("␍", "\r", 150)
    .replace("␞", "\x1e", 150)
)

configInString = sys.argv[2]
linkToFile = sys.argv[3]

config = dict()

for el in configInString.replace("'", "").split("|"):
    if el:
        key, value = el.split("=")
        config[key] = value

columns = config.pop("columns")
sec_level = config.pop("errorLevel")

dc = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "A": 10,
    "B": 11,
    "C": 12,
    "D": 13,
    "E": 14,
    "F": 15,
}


fn = lambda x: dc[x[0]] * 16 + dc[x[1]]


els = re.findall(r"x[A-F0-9]{2}", data)
encoded = list(map(lambda e: fn(e[1:]), els))
chars = "".join(list(map(chr, encoded)))

if len(els) > 2:
    for en in els:
        data = data.replace(en, "")
    data += chars

codes = encode(
    config,
    data,
    columns=int(columns),
    security_level=int(sec_level),
    numeric_compaction=True,
)

image = render_image(codes)
image.save(f"./uploads/barcodes/{linkToFile}.png")

# svg = render_svg(codes, color="black")
# svg.write(f"./uploads/barcodes/{linkToFile}.svg")
