export const ADD_FILES = "ADD_FILES";
export const REMOVE_FILES = "REMOVE_FILES"; 

export const addFiles = (files) => ({
    type: ADD_FILES,
    payload: files
})

export const removeFiles = (files) => ({
    type: REMOVE_FILES,
    payload: files
})
export const selectImage = (image) => ({
    type: "Select_Image",
    payload: image
})