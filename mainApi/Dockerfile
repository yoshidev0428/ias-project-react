FROM python:3.10.10-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# ENV NVIDIA_VISIBLE_DEVICES all
# ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

WORKDIR /app

COPY ./mainApi/requirements.txt /requirements.txt

# additional dependencies
# netcat used for checking for resources on the network before start, see start.sh for use
RUN apt-get update && \
    apt-get install -y netcat

# Install dependencies to solve dependency bug: openslide
RUN apt-get install -y openslide-tools && \
    apt install -y build-essential && \
    apt install -y default-jdk && \
    pip install --upgrade pip \
    pip install openslide-python \
    pip install numpy==1.23.5 \
    pip install opencv-python \ 
    pip install opencv-contrib-python \
    pip install --upgrade cellpose \
    pip install --upgrade numba \
    pip install -r /requirements.txt

EXPOSE 8000

# COPY ./mainApi /app/mainApi/
# RUN mkdir -p /app/mainApi/app/static
# RUN chmod -R 777 /app/mainApi/app/static
## Copy shared
# COPY ./docker_compose_libs/shared_utils/ /app/shared_utils/
# COPY ./docker_compose_libs/celery_tasks/ /app/celery_tasks/


