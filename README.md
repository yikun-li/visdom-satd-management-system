# DebtViz: A Tool for Identifying, Measuring, Visualizing and Monitoring Self-Admitted Technical Debt

## Abstract

Technical debt, specifically Self-Admitted Technical Debt (SATD), remains a significant challenge for software developers and managers due to its potential to adversely affect long-term software maintainability.
Although various approaches exist to identify SATD, tools for its comprehensive management are notably lacking.
This paper presents DebtViz, an innovative SATD tool designed to automatically detect, classify, visualize and monitor various types of SATD in source code comments and issue tracking systems.
DebtViz employs a Convolutional Neural Network-based approach for detection and a deconvolution technique for keyword extraction.
The tool is structured into a back-end service for data collection and pre-processing, a SATD classifier for data categorization, and a front-end module for user interaction.
DebtViz not only makes the management of SATD more efficient but also provides in-depth insights into the state of SATD within software systems, fostering informed decision-making on managing it.
The scalability and deployability of DebtViz also make it a practical tool for both developers and managers in diverse software development environments.
The source code of DebtViz is available at *https://github.com/yikun-li/visdom-satd-management-system* and the demo of DebtViz is at *https://youtu.be/QXH6Bj0HQew*.

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
