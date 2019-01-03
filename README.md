# MACIF Health Guide
Watch demo at https://naturalpad.github.io/healthguide.
## Installation
After cloning repo, run
```bash
npm install
```
in order to install dependencies (developped with nodejs v8.9.4).
## Development
To run a development server with hotreload use
```bash
npm run develop
```
See `package.json` for other `npm run` scripts. [Webpack](https://webpack.js.org/) is used as the main toolchain.
## Build
To build a hostable version, use
```bash
npm run build:prod
```
that will create a `dist` folder containing the site content.
To upload to `github` use
```bash
npm run gh-pages
```
As a shortcut, use
```bash
npm run deploy
```
To build, encrypt and upload in one command.

