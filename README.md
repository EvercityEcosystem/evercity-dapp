# Evercity dApp

## Quick Start

Run command `yarn && yarn start` for starting webpack dev server. You also need to install polkadot extension for your browser for using this project

App connects to `ws://node.tryevercity.com` address by default.
You can specify the address via `WS_PROVIDER_URL` environment variable if you want to check your own node.

## Deploy

1. Install Heroku CLI https://devcenter.heroku.com/articles/heroku-cli
2. Run command `heroku login` and log in in opened browser window
3. Run command `bash desploy.sh`
