<center>

<!-- <img align="center" src="https://raw.githubusercontent.com/agifm-team/AGI-Client/dev/public/favicon.ico?raw=true" height="380"> -->

<br/>

<p>
    <a rel="me" href="https://equestria.social/@JasminDreasond"><img src="https://img.shields.io/badge/Equestria-Social-2b90d9.svg?style=for-the-badge" alt="Equestria Social" /></a>
    <a href="https://www.patreon.com/JasminDreasond"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg?logo=patreon&style=for-the-badge" alt="Patreon" /></a>
    <a href="https://ud.me/jasmindreasond.x"><img src="https://img.shields.io/badge/-Wallet-ecf0f1?style=for-the-badge&logo=Ethereum&logoColor=black" alt="Wallet" /></a>
    <a href="https://ko-fi.com/jasmindreasond"><img src="https://img.shields.io/badge/donate-ko%20fi-29ABE0.svg?logo=ko-fi&style=for-the-badge" alt="Ko-Fi" /></a>
    <a href="https://twitter.com/JasminDreasond"><img src="https://img.shields.io/twitter/follow/JasminDreasond?color=00acee&style=for-the-badge&logo=twitter" alt="Twitter" /></a>
</p>

</center>

# Multi.so

A Cinny fork Matrix client focusing primarily on AI Agent utility with a simple, elegant and secure interface. The main goal is to build an Agent platform that is easy to use and has a pro tools for ai assisted productivity and fun.

## Getting started
Web app is available at https://client.pony.house/ and gets updated on each new release.

To host Pony House on your own, download tarball of the app from [GitHub release](https://github.com/agifm-team/AGI-Client/releases/latest).
You can serve the application with a webserver of your choice by simply copying `dist/` directory to the webroot. 
To set default Homeserver on login and register page, place a customized [`config.json`](config.json) in webroot of your choice.

## Auto select custom domain

Example: https://client.pony.house/#matrix.org

When the page loads, the application will automatically try to load the selected custom homeserver. This is useful if you want to refer a friend directly using your homeserver url.

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
