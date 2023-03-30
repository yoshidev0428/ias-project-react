#!/bin/bash

# Start Gunicorn processes
echo Starting Uvicorn.
exec uvicorn --reload ilastik.app.main:app --host 0.0.0.0 --port 8001