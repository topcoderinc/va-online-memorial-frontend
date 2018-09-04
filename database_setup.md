# VA Online Memorial Database Set Up

The data dump you will need to use to set up the database is in the Rest API Repo:  https://github.com/topcoderinc/va-online-memorial-rest-api/docs/vaonline.sqlc

You will also need the frontend repo: https://github.com/topcoderinc/va-online-memorial-frontend

And PostgreSQL: download at postgresql.org or `$ brew install postgres`

Pop open your terminal if you didn’t already for Homebrew
Create database with the command: `$ psql vaonline -U username`. The database name should be ‘vaonline’. Remember your username and password! You will need those later!
`$ cd` to where the data dump is
Run `$ pg_restore -U postgres --dbname=vaonline -c vaonline.sqlc` 

You should see: 
```pg_restore: [archiver (db)] Error from TOC entry 3373; 0 0 ACL public aws_broker
pg_restore: [archiver (db)] could not execute query: ERROR:  role "aws_broker" does not exist
    Command was: REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM aws_broker;
GRANT ALL ON SCHEMA public TO aws_broker;
GRANT ALL ON SCHEMA public TO PUBLIC;

WARNING: errors ignored on restore: 66
```


Open your database: `$ psql vaonline`

You should see ‘vaonline=#’ 
Run `$ \d+ *`
You should see something similar to: 
```
List of relations
 Schema |              Name              |   Type   | Owner |    Size    | Description
--------+--------------------------------+----------+-------+------------+-------------
 public | BadgeTypes                     | table    | user  | 8192 bytes |
 public | BadgeTypes_id_seq              | sequence | user  | 8192 bytes |
 public | Badges                         | table    | user  | 0 bytes    |
 public | Badges_id_seq                  | sequence | user  | 8192 bytes |
 public | Branches                       | table    | user  | 8192 bytes |
…
```

And you have a database! Any time you come back to work on the Online Memorial, make sure PostgrSQL is running. 

From here, you can skip to the ‘[3]REST API Module’ section of the VA Online Memorial Deployment Guide V2 in the Frontend Repo. 

## Troubleshooting: 
It is recommended that after you import the database, you use a service like [Postico](https://eggerapps.at/postico/) to view the tables and ensure the database imported correctly. 

Go to the ‘Veterans’ table.

If you see a single entry (first name:ffff middle name: mmmm last name: llll), you need to complete the following steps:

Select all the tables (don't worry about the folders at the bottom)
Right click > delete, select the checkbox for ‘cascade’, follow the prompts. 

Go back to terminal and re-run: `$ pg_restore -U postgres --dbname=vaonline -c vaonline.sqlc`

Go back to Postico and hit the refresh botton (top right-side)

You should have a bunch of Veteran’s names! Tah-dah! 
