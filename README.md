# Workouter API

API for [Workouter UI](https://github.com/diegocasmo/workouter-ui).

*Note: This is still work in progress. More documentation is on its way :).*

## Installation
  - Run `yarn install` to install dependencies

## Local Development
  - Start `yarn dev`

## Running Unit Tests
  - `yarn test`

### Heroku deployment
  - Run the following commands to deploy the app to Heroku:
    - These commands assume you have added the Heroku app remote (i.e., `heroku git:remote -a workouterapi`)
``` bash
heroku maintenance:on -a workouterapi
git push heroku master
heroku maintenance:off -a workouterapi
```
