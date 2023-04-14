#!/bin/bash

# Start Uvicorn processes
echo Starting Uvicorn.
exec uvicorn --reload --reload-delay 10.0 mainApi.app.main:app --host 0.0.0.0 --port 8000
