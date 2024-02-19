<center>
<!-- <img align="center" src="https://raw.githubusercontent.com/pixxels-team/Pixxels-App/dev/public/favicon.ico?raw=true" height="380"> -->
</center>

# Pixxels

Build and join AI communities with a simple, elegant and secure interface. The main goal is to build an Ai native collaboration platform that is easy to use and has a pro tools for ai assisted productivity and fun.

## Getting started
Web app is available at https://pixx.co and gets updated on each new release.

To host Pixxels-App on your own, download tarball of the app from [GitHub release](https://github.com/pixxels-team/Pixxels-App/releases/latest).
You can serve the application with a webserver of your choice by simply copying `dist/` directory to the webroot. 
To set default Homeserver on login and register page, place a customized [`.env`](.env) in webroot of your choice.

If you want to use devtools in production mode in the destkop version before the application is opened, type `--devtools` after the file path.

## Local development
> We recommend using a version manager as versions change very quickly. You will likely need to switch 
between multiple Node.js versions based on the needs of different projects you're working on. [NVM on windows](https://github.com/coreybutler/nvm-windows#installation--upgrades) on Windows and [nvm](https://github.com/nvm-sh/nvm) on Linux/macOS are pretty good choices. Also recommended nodejs version Hydrogen LTS (v18).

Execute the following commands to start a development server (or a Ionic environment):
```sh
yarn setup # Installs all dependencies
yarn start # Serve a development version
```

To build the web app:
```sh
yarn build # Compiles the app into the dist/ directory
```

### Electron (Desktop)
> While you're using the app's dev mode, it's normal for the app to show that it's disconnected for a few seconds before fully loading the page. Notifications may not mute OS sound in application dev mode. The same thing can happen for notification click events to fail only in dev mode.

The application has only been tested on the linux platform. But that won't stop you from trying to deploy to Windows or Mac.

Execute the following commands to start a development server (or a Ionic environment):
```sh
yarn setup # Installs all dependencies
yarn electron:start # Serve a development version
```

To build the desktop app:
```sh
yarn electron:build # Compiles the app into the release/ directory
```
## FAQ

### Is my data shared with third parties?

Nope. This repository creator is not sharing data with third parties. This makes the project solely dependent on the community if any new glitch is discovered. The only people capable of collecting data are the homeserver owners and third-party stuff.

### Why is the list of homeservers empty by default instead of having default homeservers like matrix.org?

This helps new matrix users not get lost when they are being guided to use a specific new homeserver.

### My website that is hosting this client was blocked from access by browser extensions.

This client sends notification permission requests at the exact moment the page is loaded. Some security extensions may consider this a privacy violation. Sometimes this type of thing doesn't happen on the Pony House domain because I (JasminDreasond) always try to contact the staff of these extensions so the domain can be added to the whitelist.

### Can I completely disable IPFS and Web3?

Yep. To disable it via the client, you need to go to the settings tabs. To permanently deactivate the features, you need to modify the `.env` file so you can deploy a client without access to the features.

### This client has web3 functionalities. Is this matrix client a crypto wallet?

Nope. Pixxels has access to crypto wallet APIs that are installed in your browser or on your computer. And this function can be turned off in the settings.

### Does the client support the purchase and sale of NFTs?

Nope. But you can install mods from third-party creators that code this type of feature.
