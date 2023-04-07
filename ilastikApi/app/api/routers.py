import asyncio
import os
from ilastik.shell.projectManager import ProjectManager
from ilastik.shell.headless.headlessShell import HeadlessShell
from ilastik.workflows.pixelClassification import PixelClassificationWorkflow
from ilastik.utility.slicingtools import sl, slicing2shape
from fastapi.responses import JSONResponse, FileResponse
from ilastikApi.config import STATIC_PATH, CURRENT_STATIC
from fastapi import (
    Request,
    Body,
    APIRouter,
    Depends,
    status,
    UploadFile,
    File,
    Form,
    HTTPException,
)
import tempfile
import numpy
import sys
import ilastik.__main__
import json
from more_itertools import consecutive_groups
from typing import List
from lazyflow.graph import Graph
from lazyflow.operators.ioOperators import OpInputDataReader
from lazyflow.roi import roiToSlice, roiFromShape
import aiofiles

ilastik_startup = ilastik.__main__

router = APIRouter(
    prefix="/image",
    tags=["image"],
)

@router.get(
    "/test_create_project",
    response_description="Test for creating ilastik project",
)
async def testCreateProject():
    projectPath = os.path.join(STATIC_PATH, 'test_ilastik_projects')
    if not os.path.exists(projectPath):
        os.makedirs(projectPath)

    project_file_path = os.path.join(projectPath, 'TestProject.ilp')

    newProjectFile = ProjectManager.createBlankProjectFile(project_file_path, PixelClassificationWorkflow, [])
    newProjectFile.close()

    return JSONResponse({"success": True})

@router.get(
    "/test_process",
    response_description="Test for creating ilastik project",
)
async def testProcess():
    projectPath = os.path.join(STATIC_PATH, 'test_ilastik_projects')
    if not os.path.exists(projectPath):
        os.makedirs(projectPath)

    project_file_path = os.path.join(projectPath, 'TestProcess.ilp')
    shell = HeadlessShell()

    sampleData = "/app/shared_static/at3.ome.tiff"
    sampleMask = "/app/shared_static/at3_mask.jpg"

    newProjectFile = ProjectManager.createBlankProjectFile(project_file_path, PixelClassificationWorkflow, [])
    newProjectFile.close()

    shell.openProjectFile(project_file_path)
    workflow = shell.workflow

    # Add a file
    from ilastik.applets.dataSelection.opDataSelection import FilesystemDatasetInfo

    info = FilesystemDatasetInfo(filePath=sampleData)
    opDataSelection = workflow.dataSelectionApplet.topLevelOperator
    opDataSelection.DatasetGroup.resize(1)
    opDataSelection.DatasetGroup[0][0].setValue(info)

    # Set some features
    ScalesList = [0.3, 0.7, 1, 1.6, 3.5, 5.0, 10.0]
    FeatureIds = [
        "GaussianSmoothing",
        "LaplacianOfGaussian",
        "StructureTensorEigenvalues",
        "HessianOfGaussianEigenvalues",
        "GaussianGradientMagnitude",
        "DifferenceOfGaussians",
    ]

    opFeatures = workflow.featureSelectionApplet.topLevelOperator
    opFeatures.Scales.setValue(ScalesList)
    opFeatures.FeatureIds.setValue(FeatureIds)

    #                    sigma:   0.3    0.7    1.0    1.6    3.5    5.0   10.0
    selections = numpy.array(
        [
            [True, False, False, False, False, False, False],
            [True, False, False, False, False, False, False],
            [True, False, False, False, False, False, False],
            [False, False, False, False, False, False, False],
            [False, False, False, False, False, False, False],
            [False, False, False, False, False, False, False],
        ]
    )
    opFeatures.SelectionMatrix.setValue(selections)

    # Add some labels directly to the operator
    opPixelClass = workflow.pcApplet.topLevelOperator

    label_data_paths = ['/app/shared_static/Labels.jpg']
    # Read each label volume and inject the label data into the appropriate training slot
    cwd = os.getcwd()
    label_classes = set()
    for lane, label_data_path in enumerate(label_data_paths):
        graph = Graph()
        opReader = OpInputDataReader(graph=graph)
        try:
            opReader.WorkingDirectory.setValue(cwd)
            opReader.FilePath.setValue(label_data_path)

            print("Reading label volume: {}".format(label_data_path))
            label_volume = opReader.Output[:].wait()
        finally:
            opReader.cleanUp()

        raw_shape = opPixelClass.InputImages[lane].meta.shape
        if label_volume.ndim != len(raw_shape):
            # Append a singleton channel axis
            assert label_volume.ndim == len(raw_shape) - 1
            label_volume = label_volume[..., None]

        # Auto-calculate the max label value
        label_classes.update(numpy.unique(label_volume))

        print("Applying label volume to lane #{}".format(lane))
        entire_volume_slicing = roiToSlice(*roiFromShape(label_volume.shape))
        opPixelClass.LabelInputs[lane][entire_volume_slicing] = label_volume

    assert len(label_classes) > 1, "Not enough label classes were found in your label data."
    label_names = [str(label_class) for label_class in sorted(label_classes) if label_class != 0]
    opPixelClass.LabelNames.setValue(label_names)

    # Train the classifier
    opPixelClass.FreezePredictions.setValue(False)
    _ = opPixelClass.Classifier.value

    # Save and close
    shell.projectManager.saveProject()
    shell.closeCurrentProject()
    del shell

    # NOTE: In this test, cmd-line args to tests will also end up getting "parsed" by ilastik.
    #       That shouldn't be an issue, since the pixel classification workflow ignores unrecognized options.
    #       See if __name__ == __main__ section, below.
    args = "--project=" + project_file_path
    args += " --headless"

    # args += " --sys_tmp_dir=/tmp"

    # Batch export options
    args += " --output_format=tiff"
    args += " --output_filename_format={dataset_dir}/{nickname}_prediction.tiff"
    args += " --output_internal_path=volume/pred_volume"
    args += " --raw_data"
    # test that relative path works correctly: should be relative to cwd, not project file.
    args += " " + os.path.normpath(os.path.relpath(sampleData, os.getcwd()))
    args += " --prediction_mask"
    args += " " + sampleMask

    old_sys_argv = list(sys.argv)
    sys.argv = ["ilastik.py"]  # Clear the existing commandline args so it looks like we're starting fresh.
    sys.argv += args.split()

    # Start up the ilastik.py entry script as if we had launched it from the command line
    try:
        ilastik_startup.main()
    finally:
        sys.argv = old_sys_argv

    return JSONResponse({"success": True})

@router.post(
    "/process_image",
    response_description="Process image",
)
async def processImage(request: Request, files: List[UploadFile] = File(...)):
    data = await request.form()
    imagePath = data.get("original_image_url")
    dataImagePath = os.path.join("/app/shared_static", 'processed_images', tempfile.mkdtemp())
    projectPath = os.path.join(STATIC_PATH, 'ilastik_projects')
    labelPath = os.path.join(STATIC_PATH, 'labels')
    projectPath = projectPath + tempfile.mkdtemp()
    labelPath = labelPath + tempfile.mkdtemp()
    labelList = data.get("label_list")
    labelList = json.loads(labelList)
    print("process-image:", labelList)

    label_data_paths = []

    if not os.path.exists(labelPath):
        os.makedirs(labelPath)

    for each_file_folder in files:
        filePath = labelPath + "/" + each_file_folder.filename
        label_data_paths.append(filePath)

        async with aiofiles.open(filePath, "wb") as f:
            content_folder = await each_file_folder.read()
            await f.write(content_folder)


    if not os.path.exists(projectPath):
        os.makedirs(projectPath)

    if not os.path.exists(dataImagePath):
        os.makedirs(dataImagePath)



    SAMPLE_MASK = os.path.join(projectPath, "mask.npy")
    numpy.save(SAMPLE_MASK, numpy.ones((2, 20, 20, 5, 1), dtype=numpy.uint8))

    project_file_path = os.path.join(projectPath, 'MyProject.ilp')

    newProjectFile = ProjectManager.createBlankProjectFile(project_file_path, PixelClassificationWorkflow, [])
    newProjectFile.close()


    shell = HeadlessShell()
    shell.openProjectFile(project_file_path)
    workflow = shell.workflow

    # Add a file
    from ilastik.applets.dataSelection.opDataSelection import FilesystemDatasetInfo

    info = FilesystemDatasetInfo(filePath=imagePath)
    opDataSelection = workflow.dataSelectionApplet.topLevelOperator
    opDataSelection.DatasetGroup.resize(1)
    opDataSelection.DatasetGroup[0][0].setValue(info)

    # Set some features
    ScalesList = [0.3, 0.7, 1, 1.6, 3.5, 5.0, 10.0]
    FeatureIds = [
        "GaussianSmoothing",
        "LaplacianOfGaussian",
        "StructureTensorEigenvalues",
        "HessianOfGaussianEigenvalues",
        "GaussianGradientMagnitude",
        "DifferenceOfGaussians",
    ]

    opFeatures = workflow.featureSelectionApplet.topLevelOperator
    opFeatures.Scales.setValue(ScalesList)
    opFeatures.FeatureIds.setValue(FeatureIds)

    #                    sigma:   0.3    0.7    1.0    1.6    3.5    5.0   10.0
    selections = numpy.array(
        [
            [True, False, False, False, False, False, False],
            [True, False, False, False, False, False, False],
            [True, False, False, False, False, False, False],
            [False, False, False, False, False, False, False],
            [False, False, False, False, False, False, False],
            [False, False, False, False, False, False, False],
        ]
    )
    opFeatures.SelectionMatrix.setValue(selections)

    # Add some labels directly to the operator
    opPixelClass = workflow.pcApplet.topLevelOperator

    # Read each label volume and inject the label data into the appropriate training slot
    cwd = os.getcwd()
    label_classes = set()
    for lane, label_data_path in enumerate(label_data_paths):
        graph = Graph()
        opReader = OpInputDataReader(graph=graph)
        try:
            opReader.WorkingDirectory.setValue(cwd)
            opReader.FilePath.setValue(label_data_path)

            print("Reading label volume: {}".format(label_data_path))
            label_volume = opReader.Output[:].wait()
        finally:
            opReader.cleanUp()

        raw_shape = opPixelClass.InputImages[lane].meta.shape
        if label_volume.ndim != len(raw_shape):
            # Append a singleton channel axis
            assert label_volume.ndim == len(raw_shape) - 1
            label_volume = label_volume[..., None]

        # Auto-calculate the max label value
        label_classes.update(numpy.unique(label_volume))

        print("Applying label volume to lane #{}".format(lane))
        entire_volume_slicing = roiToSlice(*roiFromShape(label_volume.shape))
        opPixelClass.LabelInputs[lane][entire_volume_slicing] = label_volume

    assert len(label_classes) > 1, "Not enough label classes were found in your label data."
    label_names = [str(label_class) for label_class in sorted(label_classes) if label_class != 0]
    opPixelClass.LabelNames.setValue(label_names)

    # Train the classifier
    opPixelClass.FreezePredictions.setValue(False)
    _ = opPixelClass.Classifier.value

    # Save and close
    shell.projectManager.saveProject()
    shell.closeCurrentProject()

    args = "--project=" + project_file_path
    args += " --headless"

    # Batch export options
    args += " --output_format=tiff"
    args += " --output_filename_format={dataset_dir}/{nickname}_prediction.tiff"
    args += " --output_internal_path=volume/pred_volume"
    args += " --raw_data"
    # test that relative path works correctly: should be relative to cwd, not project file.
    args += " " + os.path.normpath(os.path.relpath(imagePath, os.getcwd()))

    print('ilastik-arg:', args)

    old_sys_argv = list(sys.argv)
    sys.argv = ["ilastik.py"]  # Clear the existing commandline args so it looks like we're starting fresh.
    sys.argv += args.split()

    # Start up the ilastik.py entry script as if we had launched it from the command line
    try:
        ilastik_startup.main()
    finally:
        sys.argv = old_sys_argv

    output_path = imagePath[:-5] + "_prediction.tiff"

    return JSONResponse({"success": True, "image_path": output_path})
