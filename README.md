# IAS-project
Image Analysis web application

Backend - FastApi

Frontend - React

## Environment Setup

### Use scripts

1. double click the start.sh file. This will download, build and run both the back-end and front-end.
2. To stop, press CTRL-C in the terminal that opened when you started the start.sh script, or close the terminal.
3. double click the stop.sh script. This will stop the back-end services.

If for some reason start.sh is not working it could be because a container or volume got corrupted.

Please run the reset.sh script and once that has finished running you can run start.sh again.


### Use docker compose
- Run the following command in the IAS-project folder to start all backend services
  ```sh
  # If this is the first time running this command it will take some time while the docker images are downloaded.
  # Future uses will be very fast.
  $ docker compose up
  ```


- To start a development version of the front end, please input the following commands.
  ```sh
  $ cd react
  
  # this will install all modules and could take some time
  $ npm install 
  
  # this will build and serve the project.
  $ npm start 
  ```
- [http://localhost:3000/]() to see the frontend


- [http://localhost:8000/docs]() to see the backend documentation


- [http://localhost:8081/devDB/]() to see the database

### Monitoring
To monitor the celery worker tasks / microservices. Go to [http://localhost:5555/]()

To monitor RabbitMQ, the message broker. Go to [http://localhost:15672/]()
And enter the username and password set in the celery_task.env file in ./env_files.
Default: 
- User: 'user'
- Password: 'password'


## License

Apache License 2.0

---
