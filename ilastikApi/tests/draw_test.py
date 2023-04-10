# Python program to explain
# cv2.polylines() method

import cv2
import numpy as np

# path QmQ
path = r'gfg.jpeg'

# Reading an image in default
# mode
image = cv2.imread(path)

# Window name in which image is
# displayed
window_name = 'Image'

# Polygon corner points coordinates
pts = np.array([[25, 70], [25, 145],
				[75, 190], [150, 190],
				[200, 145], [200, 70],
				[150, 25], [75, 25]],
			np.int32)

pts = pts.reshape((-1, 1, 2))

isClosed = True

# Green color in BGR
color = (0, 255, 0)

# Line thickness of 8 px
thickness = 8

# Using cv2.polylines() method
# Draw a Green polygon with
# thickness of 1 px
image = cv2.polylines(image, [pts],
					isClosed, color,
					thickness)

# Displaying the image
while(1):
	
	cv2.imshow('image', image)
	if cv2.waitKey(20) & 0xFF == 27:
		
		break
cv2.destroyAllWindows()
