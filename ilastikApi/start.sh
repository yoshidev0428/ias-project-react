#!/bin/bash

# Start Uvicorn processes
echo Starting Uvicorn.
exec uvicorn \
    --reload \
    --reload-delay 10.0 \
    ilastikApi.app.main:app \
    --host 0.0.0.0 \
    --port 8001
