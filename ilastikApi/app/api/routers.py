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

ilastik_startup = ilastik.__main__

router = APIRouter(
    prefix="/api",
    tags=["api"],
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

@router.post(
    "/process_image",
    response_description="Process image",
)
async def processImage(request: Request):
    data = await request.form()
    imagePath = data.get("origial_image_url")
    dataImagePath = os.path.join("/app/shared_static", 'processed_images', tempfile.mkdtemp())
    projectPath = os.path.join(STATIC_PATH, 'ilastik_projects', tempfile.mkdtemp())

    if not os.path.exists(projectPath):
        os.makedirs(projectPath)

    if not os.path.exists(dataImagePath):
        os.makedirs(dataImagePath)

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

    opPixelClass.LabelNames.setValue(["Label 1", "Label 2"])

    slicing1 = sl[0:1, 0:10, 0:10, 0:1, 0:1]
    labels1 = 1 * numpy.ones(slicing2shape(slicing1), dtype=numpy.uint8)
    opPixelClass.LabelInputs[0][slicing1] = labels1

    slicing2 = sl[0:1, 0:10, 10:20, 0:1, 0:1]
    labels2 = 2 * numpy.ones(slicing2shape(slicing2), dtype=numpy.uint8)
    opPixelClass.LabelInputs[0][slicing2] = labels2

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
    args += " " + imagePath

    old_sys_argv = list(sys.argv)
    sys.argv = ["ilastik.py"]  # Clear the existing commandline args so it looks like we're starting fresh.
    sys.argv += args.split()

    # Start up the ilastik.py entry script as if we had launched it from the command line
    try:
        ilastik_startup.main()
    finally:
        sys.argv = old_sys_argv

    return JSONResponse({"success": True})
