# coding: utf-8
import sys
import json
sys.path.append(f'./libs')

from libs import code128
import sys
data = sys.argv[1]
linkToFile = sys.argv[2]

code128.image(data).save(f"./uploads/barcodes/{linkToFile}.png")

# with open(f"./barcodes/{linkToFile}.svg", "w") as f:
#         f.write(code128.svg(data))
#         f.close()