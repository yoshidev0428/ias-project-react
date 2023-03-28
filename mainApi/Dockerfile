FROM python:3.9-slim

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
RUN apt install -y openslide-tools && \
    apt install -y build-essential && \
    apt install -y git && \
    apt install -y default-jdk && \
    apt install -y curl && \
    pip install numpy==1.23.5 && \
    pip install -r /requirements.txt && \
    curl https://repo.anaconda.com/miniconda/Miniconda3-py39_23.1.0-1-Linux-x86_64.sh -o ~/miniconda.sh && \
    bash ~/miniconda.sh -b && \
    ~/miniconda3/bin/conda install mamba -y -n base -c conda-forge && \
    ~/miniconda3/bin/mamba create -y -n ilastik --override-channels -c pytorch -c ilastik-forge -c conda-forge ilastik && \
    ~/miniconda3/bin/conda init

EXPOSE 8000
