# sales-query-portal
### HOW TO MAKE CHANGES TO APPSCRIPT <br/>
whenever you make changes to the app script code. <br/>
deploy the app script code as a web app in new deployment. <br/>
then past the url you get in the env of this repo. <br/>
for the website to be able to make requests to the appscript. <br/>

### HOW TO ADD A NEW USER <br/>
go to https://console.firebase.google.com <br/>
open ```Sales-Query``` project <br/>
left sidebar -> Authentication -> AddUser <br/>
additionally to make the user an admin you also need to  <br/>
left sidebar -> Firestore Database -> collection:portal-admins -> Add document -> Auto-ID -> feild:email  type:string value:```EMAILOFTHEADMIN``` <br/>

### DEPLOY THE CHANGED CODE TO FIREBASE<br/>
make sure you have required permissions. <br/>
do  <br/>
    ```firebase login```  <br/>
and then  <br/>
    ```npm run deploy```  <br/>
this will make the changes you made locally be deployed to the hosted firebase app. for more info checkl firebase hosting docs. <br/>
 <br/>
  <br/>
--- mohammed mehdi
