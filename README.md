
clone repo

#build the image 
docker build -t jsdemo .

#run the image 
docker run -d -p 80:80 --name jsdemo-container jsdemo



