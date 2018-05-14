# CleanCloud

  CleanCloud is an AWS manager for tracking and autonomously monitoring different cloud resources in
multiple regions. The software automatically destroys cloud resources that are no longer needed
or used and notifies their owners to give them control. This project was developed as a senior
project for Fischer International Identity to reduce costs and clean up AWS resources used by
the company for testing and development.

  The application utilizes the MEAN stack (Angular 5, Node.js, MongoDB, and Express). The janitor
uses the Netflix Simian Army Janitor Monkey which is run inside a Docker container. The software
integrates with Jenkins for cluster destruction. The AWS SDK is used to retrieve data about the
resources for display and cost calculations.
