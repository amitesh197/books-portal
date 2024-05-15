# sales-query-portal

## how to run the project locally

cd to the project directory
`npm install`
`npm run dev`

# About the database

1. Log in to the AWS Management Console.
2. Navigate to the DynamoDB service.
3. Once in the DynamoDB console, look to the left-hand menu, and select "Explore items."
4. select the "queries" table.

i am using aws lamda functions to interact with the database

# About the lambda function

1. Log in to the AWS Management Console.
2. Navigate to the Lambda service.
3. In the Lambda dashboard, select the function named "getAllQueries."

here you can see the code for the lambda function, it is written in node.js, and it is used to get all the queries from the database. <br/>
This Lambda function is designed to handle HTTP requests (GET, POST, PUT, DELETE) to interact with a DynamoDB table named "queries." Let's break down its components:

Import Statements: The function imports necessary modules from the AWS SDK for JavaScript, such as DynamoDBClient, DynamoDBDocumentClient, and SESClient for DynamoDB and SES (Simple Email Service) operations.

Initialization: It initializes the SES client for sending emails and the DynamoDB client and document client for database operations. It also defines the name of the DynamoDB table (tableName).

getOrigin Function: This function validates and returns the allowed origin for CORS (Cross-Origin Resource Sharing) purposes. It checks if the requested origin is in the allowed list; otherwise, it sets a default origin.

handler Function: This is the main Lambda handler function that processes incoming events (HTTP requests) and triggers appropriate actions based on the HTTP method.

Switch Statement: It switches based on the HTTP method (GET, POST, PUT, DELETE) received in the event.

Try-Catch Block: It wraps the main logic and error handling code.

HTTP Method Cases:

GET: Scans the DynamoDB table and returns all items.
POST: Adds a new item to the DynamoDB table.
DELETE: Deletes an item from the DynamoDB table based on the provided ID.
PUT:
Updates the status of a query in the DynamoDB table. If the status is "Done," it fetches the query details, constructs an email, and sends it using SES.
If the query type indicates a specific email heading, it constructs the appropriate email heading.
It constructs the email body with the query details and sends it to the user's email address retrieved from the DynamoDB table.
Updates the status of the query in the DynamoDB table.
Finally Block: Converts the response body to a JSON string.

Return Statement: Returns the HTTP response with the appropriate status code, response body, and CORS headers.

This Lambda function essentially serves as an API endpoint to interact with a DynamoDB table, allowing CRUD operations (Create, Read, Update, Delete) and email notifications for certain query types. It's designed to handle requests from a web application or API client.

# HOW TO ADD A NEW USER <br/>

1. Open the AWS Management Console.
2. Navigate to the Cognito service.
3. In the Cognito dashboard, select the user pool named "sales query user pool."
4. Click on "Users and groups" in the left-hand menu.
5. Choose "Create user" to add a new user to the pool.
6. For the alias, select "email"
7. Ensure that the option to send an invitation is unchecked.
8. Set the username, typically using their name or a unique identifier.
9. Enter the user's email address.
10. Leave the phone number field empty.
11. Set a temporary password; "Test@1234".
12. Don't forget to add a the first row of headers to the sheet which is created in google sheets. we are using sheets to store the call and chat data of the user.

when the user will first login, they will be asked to change their password. you can do it yourself for them, go to https://sales.sarrthiias.in/login and enter the password (Test@1234
) then change it to something else, i keep it the same, and then once logged in, send the email and password to saurabh sir. <br/>

# How to make changes in website

We are using github and firebase hosting to host the website. <br/>
after making changesl

1. git add .
2. git commit -m "message"
3. git push

then to deploy the changes ,

1. npm run deploy
