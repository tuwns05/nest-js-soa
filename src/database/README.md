# SQL Server connection

AppModule configures TypeOrmModule.forRoot() directly in `src/app.module.ts`.
It connects to `localhost\VIETTUAN`, database `SOA_DATN`,
using the Windows account running Node.js (Windows Authentication).

Dependencies: `@nestjs/typeorm`, `typeorm`, `mssql`, and `msnodesqlv8`.
The machine also needs ODBC Driver 17 for SQL Server.

Edit the connection settings directly in `src/app.module.ts`.
Windows Authentication uses no SQL username or password. The named instance
is configured instead of assuming that SQL Server listens on port 1433.

Run `npm.cmd run start:dev`. The application waits for the database
connection before opening its HTTP port. The Windows account must have
access to `SOA_DATN`, and the `VIETTUAN` SQL Server instance must be running.
For TCP connections to a named instance, check TCP/IP and SQL Server Browser
if the client cannot resolve or reach the instance.

Encryption is disabled for this local development setup, as in the provided
sample. Configure encryption and a trusted server certificate for deployment.

`synchronize: false` prevents automatic table creation or schema changes.
Register future entities with `TypeOrmModule.forFeature([YourEntity])`
in their feature modules; `autoLoadEntities` adds them to this connection.
