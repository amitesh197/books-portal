# sales-query-portal
HOW TO MAKE CHANGES TO APPSCRIPT
whenever you make changes to the app script code.
deploy the app script code as a web app in new deployment.
then past the url you get in the env of this repo.
for the website to be able to make requests to the appscript.

HOW TO ADD A NEW USER
go to https://console.firebase.google.com
open Sales-Query project
left sidebar -> Authentication -> AddUser
additionally to make the user an admin you also need to 
left sidebar -> Firestore Database -> collection:portal-admins -> Add document -> Auto-ID -> feild:email  type:string   value:<EMAILOFTHEADMIN>

--- mohammed mehdi
the appscript and react code is well ddocumented
