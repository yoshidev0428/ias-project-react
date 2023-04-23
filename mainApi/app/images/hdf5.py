# import required libraries
import os
import h5py as h5
import numpy as np
import matplotlib.pyplot as plt

# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

# wd=os.chdir('/main.py') #change the file path to your working directory
wd=os.getcwd() #request what is the current working directory
print(wd) #show what is the current working directory

def print_hi(name):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press Ctrl+F8 to toggle the breakpoint.

def test():
    with h5.File('example.h5', 'w') as f:
    # create a group
        group = f.create_group('mygroup')
        
        # create a dataset inside the group
        data = [1, 2, 3, 4, 5]
        group.create_dataset('mydata', data=data)
    
# read the data from the file
    with h5.File('example.h5', 'r') as f:
        # get the dataset
        dataset = f['mygroup/mydata']
        
        # print the dataset
        print(dataset[:])
# Press the green button in the gutter to run the script.

if __name__ == '__main__':

    # Read H5 file
    f = h5.File("NEONDSImagingSpectrometerData.h5", "r")
    # Get and print list of datasets within the H5 file
    datasetNames = [n for n in f.keys()]
    for n in datasetNames:
        print(n)
    # extract reflectance data from the H5 file
    reflectance = f['Reflectance']
    # extract one pixel from the data
    reflectanceData = reflectance[:,49,392]
    reflectanceData = reflectanceData.astype(float)

    # divide the data by the scale factor to convert the integer values into floating point values
    # note: this information would be accessed from the metadata
    scaleFactor = 10000.0
    reflectanceData /= scaleFactor
    wavelength = f['wavelength']
    wavelengthData = wavelength[:]
    #transpose the data so wavelength values are in one column
    wavelengthData = np.reshape(wavelengthData, 426)

    # Print the attributes (metadata):
    print("Data Description : ", reflectance.attrs['Description'])
    print("Data dimensions : ", reflectance.shape, reflectance.attrs['DIMENSION_LABELS'])

    # print a list of attributes in the H5 file
    for n in reflectance.attrs:
        print(n)
        # close the h5 file
        f.close()
    		# Plot
    plt.plot(wavelengthData, reflectanceData)
    plt.title("Analysis Spectra")
    plt.ylabel('Reflectance')
    plt.ylim((0,1))
    plt.xlabel('Wavelength [$\mu m$]')
    plt.show()
	    
    # Write a new HDF file containing this spectrum
    f = h5.File("VegetationSpectra.h5", "w")
    rdata = f.create_dataset("VegetationSpectra", data=reflectanceData)
    attrs = rdata.attrs
    attrs.create("Wavelengths", data=wavelengthData)
    f.close()

    test()
# See PyCharm help at https://www.jetbrains.com/help/pycharm/
