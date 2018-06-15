# VA ONLINE MEMORIAL - LOCAL DEPLOYMENT

The Department of Veterans Affairs' (VA) National Cemetery Administration (NCA) seeks to create an interactive digital experience that enables virtual memorialization of the millions of people interred at VA national cemeteries. This online memorial space will allow visitors to honor, cherish, share, and pay their respects and permit researchers, amateurs, students, and professionals to share information about Veterans.

## [1] PostgreSQL CONFIGURATION

Go to PostgreSQL [download page](https://www.postgresql.org/download/) and select the platform and install the PostgreSQL server using default settings.

- To check the installtion on Windows; Use services (Start -> Run -> services.msc) and look for the `postgresql-[version]` service.
- On Linux run `which psql` and macOS `ps auxwww | grep postgres`
- Now open the **pgAdmin 4** from the start menu and it will open the admin panel on the browser [http://127.0.0.1:58464/browser/](http://127.0.0.1:58464/browser/). Then create a new database named '**vaonline**'. 

![](https://content.screencast.com/users/dilhanig/folders/Default/media/b1ea7399-2582-4752-94b7-04a169ceafef/PostgreSQL.gif)


## [2] [DATA IMPORT & SYNC MODULE](https://github.com/topcoderinc/va-online-memorial-data-scraper)

### Dependencies ###

-   [Nodejs](https://nodejs.org/en/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [ESLint](http://eslint.org/)

### [1] Nodejs Installation ###

Install Nodejs latest stable version from [here](https://nodejs.org/en/download/)

-  Windows (Check your system is 32bit or 64bit)/ macOS: [https://nodejs.org/en/download/](https://nodejs.org/en/download/) 
-  Linux: 

<pre>
$ sudo apt-get update
$ sudo apt-get install nodejs
$ sudo apt-get install npm
</pre>

You can check whether Nodejs is properly installed on your system by typing `node -v` or `node --version` on Windows platform and `nodejs -v` on Linux

### [2] ESLint Installation ###

If you want to include ESLint as part of your project's build system, we recommend installing it locally

`$ npm install eslint --save-dev`

If you want to make ESLint available to tools that run across all of your projects, we recommend installing ESLint globally.

`$ npm install -g eslint`

## Configuration

-   Edit configuration in `config/default.json` 
-   Custom environment variables names in `config/custom-environment-variables.json`,

## Application Constants

-   Application constants can be configured in `./constants.js`

## Available Tools

Since the data we need to download and process is huge it's better (/ safer) to use 2 different tools instead of one single script so in case that something goes wrong during processing, we'll minimise the damage.

### [1] Download Datasets

-   `git clone git@github.com:topcoderinc/va-online-memorial-data-scraper.git`
-   Go inside the application directory `cd va-online-memorial-data-scraper` and execute the below commands
-   Run `npm i`
-   Run `npm run download-data` to download all available datasets.

<pre>
[2018-05-24T04:44:07.517Z][INFO] Downloading dataset: Gravesite locations of Vet
erans and beneficiaries in WASHINGTON, as of January 2018.
[2018-05-24T04:44:07.825Z][INFO] Download completed!
[2018-05-24T04:44:07.825Z][INFO] Downloading dataset: Gravesite locations of Vet
erans and beneficiaries in WEST VIRGINIA, as of January 2018.
[2018-05-24T04:44:09.643Z][INFO] Download completed!
[2018-05-24T04:44:09.643Z][INFO] Downloading dataset: Gravesite locations of Vet
erans and beneficiaries in WISCONSIN, as of January 2018.
[2018-05-24T04:44:22.532Z][INFO] Download completed!
[2018-05-24T04:44:22.533Z][INFO] Downloading dataset: Gravesite locations of Vet
erans and beneficiaries in WYOMING, as of January 2018.
[2018-05-24T04:44:23.328Z][INFO] Download completed!
[2018-05-24T04:44:23.329Z][INFO] Operation completed!
</pre>

-   The datasets will be stored in the configured directory. In this case `\downloads`. You can configure the location from `config/default.json` file.
-   Old data will be replaced and this operation does not affect the database.

### [2] Import data from downloaded files

-   Run `npm run import-data` to import all data using the downloaded files from the previous step.

## Local Deployment

*Before starting the application, make sure that PostgreSQL is running and you have configured everything correctly in `config/default.json`* Without doing the two steps separately you can execute the below commands to do the same.

-   `git clone git@github.com:topcoderinc/va-online-memorial-data-scraper.git`
- Edit configuration file `config/default.json`

**`"db_url": "postgres://<Username>:<Password>@<Host IP or Name>:<Port>/<Database>"`**
`"db_url": "postgres://postgres:123@localhost:5432/vaonline"`

-   Go inside the application directory `cd va-online-memorial-data-scraper` and execute the below commands
-   Install dependencies `npm i`
-   Run lint check `npm run lint`
-   Start scraper `npm run scrape`. This will run all tools in the following sequence:

`npm run download-data` => `npm run import-data`

*The application will print progress information and the results in the terminal.*

## Verification

-   To verify that the data is imported, you can use the [pgAdmin](https://www.pgadmin.org/) tool and browser the database.

![](https://content.screencast.com/users/dilhanig/folders/Default/media/109c2f2e-2966-4dd7-a351-c6dfefd70773/pgAdmin.jpg)

## Notes

-   The total size of all datasets is > 1.5GB so it will take quite some time, depending on your internet connection, to finish the operation.
-   `max_old_space_size` has been set to *4096MB* to allow parse/process such huge data files without any issues. The app will clean the memory right after using the data to prevent memory/heap leaks.
-   The dataset for `FOREIGN ADDRESSES` doesn't have a header in the CSV file and it has slightly different format (it has an extra column). The app handles all datasets without any issue.


## [3] [REST API MODULE](https://github.com/topcoderinc/va-online-memorial-rest-api)

### Dependencies ###

-   [Nodejs](https://nodejs.org/en/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Express](https://expressjs.com/)
-   [ESLint](http://eslint.org/)
-   [Postman](https://www.getpostman.com/) for verification.

### Express Installation ###

Open Command Prompt on Windows and Terminal on macOS/Linux and execute below command

`$ npm install express --save`


## Configuration
-   Edit configuration in `config/default.json` 
-   Custom environment variables names in `config/custom-environment-variables.json`,

## Application Constants

-   Application constants can be configured in `./constants.js`


## Local Deployment

*Before starting the application, make sure that PostgreSQL is running and you have configured everything correctly in `config/default.json`*

-   `git clone git@github.com:topcoderinc/va-online-memorial-rest-api.git`
-   Edit configuration file `config/default.json`

**`"db_url": "postgres://<Username>:<Password>@<Host IP or Name>:<Port>/<Database>"`**
`"db_url": "postgres://postgres:123@localhost:5432/vaonline"`

-   Go inside the application directory `cd va-online-memorial-rest-api` and execute the below commands
-   Install dependencies `npm i`
-   Run lint check `npm run lint`
-   Initialize database data `npm run init-data`. You will see a success message like below

<pre>
E:\tc-apps\va-online-memorial-rest-api>npm run init-data

> @va/rest-api@0.0.1 init-data E:\tc-apps\va-online-memorial-rest-api`
> node init-data.js

sequelize deprecated String based operators are now deprecated. Please use Symb
l based operators for better security, read more at http://docs.sequelizejs.com
manual/tutorial/querying.html#operators node_modules\sequelize\lib\sequelize.js
242:13
[2018-05-24T02:22:53.525Z][INFO] success!
</pre>

-   Start the REST API `npm start`.

<pre>

E:\tc-apps\va-online-memorial-rest-api>npm start

> @va/rest-api@0.0.1 start E:\tc-apps\va-online-memorial-rest-api
> node app.js

sequelize deprecated String based operators are now deprecated. Please use Symbo
l based operators for better security, read more at http://docs.sequelizejs.com/
manual/tutorial/querying.html#operators node_modules\sequelize\lib\sequelize.js:
242:13
[2018-05-24T02:44:07.028Z][INFO] Server listening on port 4000 in development mo
de
</pre>

## Postman Verification

-   To verify the REST API, you can import the collection & environment from `/docs` in [Postman](https://www.getpostman.com/)

# [4] [DATA MODELS MODULE](https://github.com/topcoderinc/va-online-memorial-data-models)

### Dependencies
-   [Nodejs](https://nodejs.org/en/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [eslint](http://eslint.org/)

## Configuration
-   Edit configuration in `config/default.json`
-   custom environment variables names in `config/custom-environment-variables.json`,

## Application constants

-   Application constants can be configured in `./constants.js`

## Local Deployment

In the project directory, you can run:

- Clone the repo using `git clone git@github.com:topcoderinc/va-online-memorial-data-models.git`
- Edit configuration file `config/default.json`

**`"db_url": "postgres://<Username>:<Password>@<Host IP or Name>:<Port>/<Database>"`**
`"db_url": "postgres://postgres:123@localhost:5432/vaonline"`

- Go inside the application directory `cd va-online-memorial-data-models` 
- Install dependencies `npm i`

# [5] [FRONTEND MODULE](https://github.com/topcoderinc/va-online-memorial-frontend)

## Configuration

Application configurations are configured in `/src/config/index.js`.

In the above file you have to change your API URL

    export const API_URL = 'http://localhost:4000/api';

## ESLint

**WARNING:** At the moment, ESLint config is missing, thus linter does not really
check anything.

Lint errors will be displayed in the terminal & console when you run `npm run dev`.

For more details refer to the starter pack documentation about eslint [here](https://github.com/facebookincubator/create-react-app/tree/master/packages/eslint-config-react-app)

## Local Deployment

In the project directory, you can run:

- Clone the repo using `git clone git@github.com:topcoderinc/va-online-memorial-frontend.git`
- Go inside the application directory `cd va-online-memorial-frontend` and execute the below commands
- Install dependencies `npm i`
- Run `npm run dev`

Above command will run the app in the development mode. It Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.You will also see any lint errors in the console.

**Front-end Console**

<pre>
Compiled successfully!

You can now view va-online-memorial-frontend in the browser.

  Local:http://localhost:3000/
  On Your Network:  http://192.168.1.70:3000/

Note that the development build is not optimized.
To create a production build, use npm run build.
</pre>

----------


`npm start`: 
Starts the app in production mode, using
[`http-server`](https://www.npmjs.com/package/http-server) as the production
server.

`npm test`: 
Launches the test runner in the interactive watch mode. See the section about [running tests](#running-tests) for more information.

`npm run build`: Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>


## Your app is ready to be tested! ##

# VA ONLINE MEMORIAL - [Cloud.gov](https://cloud.gov/) DEPLOYMENT

## [1] Get access to cloud.gov

People with U.S. federal government email addresses can get access to a free sandbox space. If your team uses cloud.gov and you don’t have a federal government email address (such as if you’re a contractor), ask a teammate to [invite you](https://cloud.gov/docs/apps/managing-teammates/)

1. After you receive the invitation via email register using the link. 
2. Now click [Login](https://login.fr.cloud.gov/login) from the [https://cloud.gov/](https://cloud.gov/)
3. Click 'Agree and Continue' button
4. Select cloud.gov
5. Enter your email and Password
6. Now you have to provide the temporary token code from your authentication app (for most people this is the Google Authenticator app you installed on your mobile phone during account creation)
7. Click Login
8. Now you can see your sandbox in "Your organizations" area
9. Click on the sandbox will display the Apps and Services but now you don't see anything

## [2] Log into the dashboard (web interface)

After login to the cloud.gov you can access the dashboard that gives you web-based access to common tasks by using this link [https://dashboard.fr.cloud.gov/](https://dashboard.fr.cloud.gov/)


## [3] Set up the command line

1. Install the Cloud Foundry CLI: [Windows](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html#windows), [Mac OS X](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html#mac), or [Linux](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html#linux). If you can’t use the installer, you can [download the CLI binary and install it manually](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html#bin).
2. Enter `cf login -a api.fr.cloud.gov --sso`
3. It’ll display `One Time Code ( Get one at https://login.fr.cloud.gov/passcode)` – visit this login link [https://login.fr.cloud.gov/passcode](https://login.fr.cloud.gov/passcode) in your browser.
4. Now you may need to log in using your email address, password, and multi-factor authentication token. 
5. After you log in, the page will display your 10-character Temporary Authentication Code.
6. Copy and paste that 10-character code into the command line (no typing indicators will show), and enter it.

<pre>
C:\Users\HP>cf login -a api.fr.cloud.gov --sso
API endpoint: api.fr.cloud.gov

Temporary Authentication Code ( Get one at https://login.fr.cloud.gov/passcode )
>
Authenticating...
OK

Targeted org sandbox-va

Targeted space jessica.tozer

API endpoint:   https://api.fr.cloud.gov (API version: 2.112.0)
User:           youremail@gmail.com
Org:            sandbox-va
Space:          jessica.tozer
</pre>

## [4] Set up the Relational database [PostgreSQL]

**NOTE**: If you are getting any permission error while running below commands; that means you don't have permission for the sandbox to perform these operations. Contact the PM and Sandbox owner to fix this issue.

- There are few DB Options but we are using PostgreSQL free instance (`shared-psql`). You can check the other options as well from [here](https://cloud.gov/docs/services/relational-database/).
- To [create a service instance](https://cloud.gov/docs/services/relational-database/#options) run `cf create-service aws-rds shared-psql vamem-db-service` or you can use the web interface to start the instance by clicking on the "Create service instance" button from action menu against the selected database option.

<pre>
C:\Users\HP>cf create-service aws-rds shared-psql vamem-db-service
Creating service instance vamem-db-service in org sandbox-va / space jessica.toz
er as youremail@gmail.com...
OK
</pre>

![](https://content.screencast.com/users/dilhanig/folders/Default/media/18daad66-1329-4a31-ab5d-a5b826d345d6/db%20instance.jpg)


- To check whether the service is created run `cf services` or you can use the "Service instances" section of the web interface to check.

<pre>
C:\Users\HP>cf services
Getting services in org sandbox-va / space jessica.tozer as youremail@
gmail.com...

name               service   plan          bound apps   last operation
vamem-db-service   aws-rds   shared-psql                create succeeded
</pre>

![](https://content.screencast.com/users/dilhanig/folders/Default/media/2cf4f104-0bba-4e8c-bf9d-50c112c278b9/dbstatus.jpg)

If you need to delete the service you can run `cf delete-service vamem-db-service` but first;

- You need to delete all the bindings with the applications. Eg: `cf unbind-service <App Name> <Service Name>` > `cf unbind-service rest-api vamem-db-service`
- Then you have to delete the service keys associated with it. To check the service keys associated with it run `cf service-keys vamem-db-service`. Then to delete it run `cf delete-service-key vamem-db-service EXTERNAL-ACCESS-KEY`


## [5] Create Your Service Key

Now you have to create a external service key to access the Database.

- First check whether you have any 'service key' assigned to this service by executing `cf service-keys vamem-db-service`. If you have no need to run the below commands. You can directly view the content by running `cf service-key vamem-db-service <Name of the Key>`
- If no key found run `cf create-service-key vamem-db-service SERVICE_CONNECT`

<pre>
E:\va-online-memorial-frontend>cf create-service-key vamem-db-service SERVICE_CONNECT
Creating service key SERVICE_CONNECT for service instance vamem-db-service 
as youremail@gmail.com...
OK
</pre>

- Then run `cf service-keys vamem-db-service` again to confirm. You will see `SERVICE_CONNECT` is created

<pre>
C:\Users\HP>cf service-keys vamem-db-service
Getting keys for service instance vamem-db-service as youremail@gmail.
com...

name
SERVICE_CONNECT
</pre>

- To view the details you have to run `cf service-key vamem-db-service SERVICE_CONNECT`

<pre>
E:\va-online-memorial-frontend>cf service-key vamem-db-service SERVICE_CONNECT

Getting key SERVICE_CONNECT for service instance vamem-db-service as 
youremail@gmail.com...

{
 "db_name": "cgawsbrokerprodahm1484iv53qpm2",
 "host": "cg-aws-broker-prod-01fb6e1ed561.ci7nkegdizyy.us-gov-west-1.rds.amazona
ws.com",
 "password": "******",
 "port": "5432",
 "uri": "postgres://u5hi9gyc5848rcib:e2280m2w0dn235ay00zd7uw1s@cg-aws-broker-pro
d-01fb6e1ed561.ci7nkegdizyy.us-gov-west-1.rds.amazonaws.com:5432/cgawsbrokerprod
ahm1484iv53qpm2",
 "username": "u5hi9gyc5848rcib"
}
</pre>


## [6] Create the application REST API

- Go to the local deployment directory `cd va-online-memorial-rest-api`
- Edit configuration file config/default.json
- You can get the `db_url` by running the command `cf service-key vamem-db-service SERVICE_CONNECT`


`
"db_url": "postgres://<Username>:<Password>@<Host IP or Name>:<Port>/<Database>"`
`"db_url": "postgres://*****:*****@cg-aws-broker-pro
d-01fb6e1ed561.ci7nkegdizyy.us-gov-west-1.rds.amazonaws.com:5432/*****"
`

- Replace the `db_url` with the provided one as above
- Update the `appURL` in the configuration file config/default.json too. Even though you haven't deployed the frontend you can put the URL as `"appURL": "https://frontend.app.cloud.gov/"`
- Keep in mind that you can replace the `frontend` with any name and then use that name when you are deploying the frontend
- Go inside the application directory `cd va-online-memorial-rest-api` and execute the below commands
- Run `cf push rest-api` and it will create a application in [cloud.gov dashboard](https://dashboard.fr.cloud.gov/#/)
- Wait till the application get deployed and status changed to 'Running'. You can check all the information from the GUI interface as well. 
- To bind the database instance with the application. Run `cf bind-service rest-api vamem-db-service`
- Run `cf restage rest-api`
- To get the `route` (URL) information, run `cf routes`. You need to have the `route` information of the `rest-api` when you are deploying the `frontend`

<pre>
E:\va-online-memorial-rest-api>cf routes
Getting routes for org sandbox-va / space jessica.tozer as youremail@g
mail.com ...

space           host       domain          port   path   type   apps       servi
ce
jessica.tozer   rest-api   app.cloud.gov                        rest-api
</pre>

## [7] Create the application Frontend

- Go to the local deployment directory `cd va-online-memorial-frontend`
- Application configurations are configured in `/src/config/index.js`. Now you have to change your API URL to `"appURL": "https://rest-api.app.cloud.gov/api"`
- Go inside the application directory `cd va-online-memorial-frontend`
- Run `cf push frontend` and it will create a application in cloud.gov
- Wait till the application get deployed and status changed to 'Running'. You can check all the information from the GUI interface as well. 


## [8] Configure Your SSH Tunnel

Now you can use [Cloud Foundry CLI Service Connection Plugin](https://github.com/18F/cf-service-connect#readme) to connect your databases or other service instances from your local machine. 

###Prerequisites

- Need 'psql CLI' to execute DB commands (Installing PostgreSQL will install this utility by default)
- [Cloud Foundry CLI](https://github.com/18F/cf-service-connect#readme)

Open a new command prompt and execute `cf connect-to-service -no-client rest-api vamem-db-service` to get the SSH tunnel info.

<pre>
C:\>cf connect-to-service -no-client rest-api vamem-db-service
Finding the service instance details...
Setting up SSH tunnel...
SSH tunnel created.
Skipping call to client CLI. Connection information:

Host: localhost
Port: 64970
Username: *******
Password: ******
Name: ******

Leave this terminal open while you want to use the SSH tunnel. Press Control-C t
o stop.
</pre>

## [9] Import data to the PostgreSQL database

Now you can start restoring the SQL dump to your cloud DB instance by following the below steps;

- Download the SQL dump file from [https://www.dropbox.com/s/dgvtv263rrcufyz/backup.sql?dl=0](https://www.dropbox.com/s/dgvtv263rrcufyz/backup.sql?dl=0)
- Place the file in C: drive
- Open the file and replace the owner name to your db user
- Open the command prompt and execute the command `psql -h localhost -p 64970  -U u5hi9gyc5848rcib cgawsbrokerprodahm1484iv53qpm2 -f < C:\backup.sql` In here you have to replace the port number, Username and Database name as specified in the SSH tunnel. Check the backup file location too.
- When the system prompt the password, enter your password (eg: `e2280m2w0dn235ay00zd7uw1s`)
- Now system will import the data to your cloud instance

## [10] Running the Application

Now open the URL  [https://frontend.app.cloud.gov/](https://frontend.app.cloud.gov/) to access the application
