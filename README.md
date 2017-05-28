# Game Statistics Server

  RESTful application that allows to collect stats of the game servers.

  ## Prerequisites

  The following software is required:

  * Node.js
  * npm
  * PostgreSQL server

  Also, you have to create the database in your Postgres server and insert the table structure described by `gamestat.sql` file. You can do it with the following command:

  ```bash
  $ psql -d myDb -f gamestat.sql
  ```

  Don't forget to specify the name of your database in `config.json` file (*dbConfig.options.database* property).

  ## Usage

  You need the env variable NODE_PATH set to the root project directory. You may set it manually each time you launch the application:

  ```bash
  $ NODE_PATH=. node app.js
  ```

Or you may set it in any other way you prefer. In that case you can just run the following:

  ```bash
  $ node app.js
  ```
