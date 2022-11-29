import os
import javabridge
import bioformats
from bioformats import logback
import sys
import math


def quickselect(list_of_numbers, k):
    """
    Input: a list of numbers and an integer 'k'.
    Output: kth smallest element in the list.
    Complexity: best case: O(n)
                worst case: O(n^2)
    """
    return _kthSmallest(list_of_numbers, k, 0, len(list_of_numbers)-1)

def _kthSmallest(arr, k, start, end):
    """
    private helper function for quickselect
    """
    # checking if k is smaller than 
    # number of elements in the list
    if (k > 0 and k <= end - start + 1): 
  
        # Partition the array with last 
        # element as the pivot and get 
        # position of pivot element in 
        # sorted array 
        pivot_index = _partition(arr, start, end) 
  
        # if position of the pivot
        # after partition is same as k 
        if (pivot_index - start == k - 1): 
            return arr[pivot_index] 
  
        # if position of the pivot 
        # is greater than k then
        # recursive call _kthSmallest 
        # on the left partition of the pivot
        if (pivot_index - start > k - 1): 
            return _kthSmallest(arr, k, start, pivot_index - 1) 
  
        # Else recursive call for right partition  
        return _kthSmallest(arr,   k - pivot_index + start - 1, pivot_index + 1, end) 
    return math.inf

def _partition(arr, l, r): 
    """ private helper function
    Input: a list and two integers: 
    l: start index of the list to be partitioned
    r: end index of the list to be partitioned
    Output: index of the pivot after partition (using arr[r] as the pivot)
    """
      
    pivot = arr[r] 
    i = l 
    for j in range(l, r): 
          
        if arr[j] <= pivot: 
            arr[i], arr[j] = arr[j], arr[i] 
            i += 1
              
    arr[i], arr[r] = arr[r], arr[i] 
    return i

def calculateImageStats(image_path):
    logback.basic_config()

    image, scale = bioformats.load_image(image_path, rescale=False, wants_max_intensity=True)
    #print(image.shape)

    minVal = 65535
    maxVal = 0
    cutoffArr = []
    for r in range(0, image.shape[0]):
        for c in range(0, image.shape[1]):
            if maxVal < image[r][c]:
                maxVal = image[r][c]
            if minVal > image[r][c]:
                minVal = image[r][c]
            if image[r][c] > 0:
                cutoffArr.append(image[r][c])

    domain = [minVal, maxVal]
    
    cutoffPercentile = 0.0005
    length = len(cutoffArr)
    topCutoffLocation = math.floor(
        length * (1 - cutoffPercentile)
    )
    bottomCutoffLocation = math.floor(length * cutoffPercentile)
    quickselect(cutoffArr, topCutoffLocation)
    _kthSmallest(cutoffArr, 0, topCutoffLocation, bottomCutoffLocation)
    contrastLimits = [
        cutoffArr[bottomCutoffLocation],
        cutoffArr[topCutoffLocation]
    ]

    print("calculateImageStats: domain, contrastLimits", domain, contrastLimits)

    return domain, contrastLimits


# javabridge.start_vm(class_path=bioformats.JARS, run_headless=True)

# domain, contrastLimits = calculateImageStats(sys.argv[1])
# print(domain, contrastLimits)

# javabridge.kill_vm()
