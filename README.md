# Self-Admitted Technical Debt Visualization and Management System

## Instructions

There are two methods to run this project. One is to use Docker and Docker Compose. The other method is to run every
module locally.

### Docker

1. Make sure to have [Docker](https://docs.docker.com/get-docker/)
   and [Docker Compose](https://docs.docker.com/compose/) installed.
2. Create a JAR build for the backend module.  
   Run `gradle bootJar` in the `backend` directory.
3. Run `docker-compose up -d` in the root directory of this repository.

### Local

1. Install a [PostgreSQL](https://www.postgresql.org/) database, you can use Docker Compose for this
   with `docker-compose up -d database`.
2. Run the frontend in the `frontend` directory either:
    - For development: `npm run dev`.
    - For production: `npm run build` and `npm run start`.
