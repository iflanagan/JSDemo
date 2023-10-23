
Pre-requisites

1. Docker Desktop installed

2. Logged into Docker (docker login)

3. Open a shell/terminal window

4. Create a new Directory under your home directory called 'DockerImages'

5. Under DockerImages/Webapp

6. git clone https://github.com/iflanagan/JSDemo.git

7. docker build -t my-web-app

8. docker run -p 8443:8080 my-web-app .

9. open a web browser locally and see if you can navigate to http://localhost:8443/JSDemo/index.html
