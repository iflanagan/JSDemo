
clone repo

#build the image 
docker build -t jsdemo .

#run the image 
docker run -d -p 80:80 --name jsdemo-container jsdemo


# if you don't have docker 

git clone 

npm install -g live-server

live-server --port=80 --host=0.0.0.0

# open browser and go to https://localhost/index.html

# now you can create your tests in testim with this web app test and playback locally 

# then run on the grid using CLI

export myToken=<token>;  export myProject=<projectID>;
testim --token $myToken --project  $myProject --grid "Testim-Grid" --name "<testimTestname>" \--turbo-mode --tunnel








