# Walmart Product Lookup

## Introduction
![Architecture Diagram](architecture/architecture.jpg)

* When a user searches for an item, it invokes Walmart Product Lookup API and the results are compressed to a lighter model.

```javascript
{
    id: <itemId>,
    name: <itemName>,
    shortDescription: <shortDescription>,
    longDescription: <longDescription>
}
```

* Then a forward index is constructed for the user input search term.
* A 'GET' endpoint is exposed to access the results.

## External APIs Used
* Walmart Product Lookup API

## Tools
* Brackets I/O
* Postman

## Tech Stack
* NodeJS
* hapi
* Wreck HTTP Client Utilities
* Good File and Good Squeeze for Logging

## Testing
* Testing Framework - Mocha
* Assertion Framework - Chai
* HTTP Request Mocking Framework - Nock
* Dependency Injection - Rewire

e.g. Navigate to project directory and run the following command to run all tests
```bash
mocha
```

## Future Work
* Improve forward index with term count (currently complicated due to pending [Stage 1 Proposal](https://github.com/tc39/proposal-optional-chaining) for optional chaining capabilities on JavaScript)
* Use Mongoose to replace in-memory DB with MongoDB.
* Use Joi to validate models after DB replacement.
* Caching
* Performance Load Testing