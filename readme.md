# Walmart Product Lookup
![Architecture Diagram](architecture/architecture.jpg)

## External APIs Used
* Walmart Product Lookup API

## Tools
* Brackets I/O
* Postman

## Tech Stack
* NodeJS
* hapi
* Wreck HTTP Client Utilities

## Future Work
* Improve forward index with term count (currently complicated due to pending [Stage 1 Proposal](https://github.com/tc39/proposal-optional-chaining) for optional chaining capabilities on JavaScript)
* Use Mongoose to replace in-memory DB with MongoDB.
* Use Joi to validate models after DB replacement.