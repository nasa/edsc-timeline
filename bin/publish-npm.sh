#!/bin/bash

# Bail on unset variables, errors and trace execution
set -eux

# Save NPM token to .npmrc
export NPM_TOKEN=$bamboo_NPM_AUTH_TOKEN_SECRET
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

# build package
npm install
npm run prepare

# publish package
# --access public because scoped packages default to private publishing
npm publish --access public
