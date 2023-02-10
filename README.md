# usabilla-api
## Description
Unofficial Usabilla API client for node.js applications

## Getting started

Install the client with npm

```bash
$ npm install wonderflow-usabilla --save
```
## Usage

Basic usage example: retrieving a list of buttons and their feedback
```js
const Usabilla = require('wonderflow-usabilla')
const usabilla = new Usabilla('access-key', 'secret-key')

const buttons = await usabilla.websites.buttons.get()

for (const { id } of buttons.items) {
    const feedback = await usabilla.websites.buttons.feedback.get({ id })

    ...
  }

```
## Documentation
For more information about the API usage, please refer to Usabilla documentation available through the official [developers guide](http://developers.usabilla.com).

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

### Pull request checklist
- [ ] Impacted code has new or updated tests
- [ ] Ensure any install or build dependencies are removed
- [ ] Update the README.md with details of changes to the interface
- [ ] Check and fix code formatting and style: `npx standard --fix`
- [ ] Pass all of the tests locally: `npm run test`