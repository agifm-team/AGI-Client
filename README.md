<p align="center">
  <img src="https://github.com/pixxels-team/Pixxels-App/blob/dev/public/img/homepage-slider/c1.gif?raw=true" alt="SpaceShip App Logo" width="800">
</p>

# Spaceship

Build and join AI communities with a simple, elegant, and secure interface. Spaceship is an AI-native collaboration platform that combines ease of use with powerful tools for AI-assisted productivity and enjoyment.

## Key Features:

- **AI Communities**: Create and participate in AI-focused communities effortlessly.
- **Elegant Interface**: Navigate through a user-friendly and intuitive design.
- **End-to-End Encryption**: Enjoy secure, E2EE chats for private communications.
- **AI-Assisted Tools**: Boost your productivity with pro-level AI tools.
- **Collaborative Environment**: Work together in an AI-native platform built for teamwork.
- **Fun and Productive**: Balance efficiency with enjoyable AI interactions.

Spaceship is designed for both AI enthusiasts and professionals, offering a perfect blend of simplicity and advanced features. Whether you're looking to collaborate on AI projects, learn from others, or simply explore the possibilities of AI, Spaceship provides the ideal launchpad for your journey.

Join us in shaping the future of AI collaboration – where security meets simplicity, and productivity meets fun!

Ready to take off? Let's explore the AI universe together with Spaceship! 🚀✨


## Getting started
Web app is available at https://spaceship.im and gets updated on each new release.

To host SpaceShip-App on your own, download tarball of the app from [GitHub release](https://github.com/pixxels-team/Pixxels-App/releases/latest).
You can serve the application with a webserver of your choice by simply copying `dist/` directory to the webroot. 
To set default Homeserver on login and register page, place a customized [`.env`](.env) in webroot of your choice.

If you want to use devtools in production mode in the desktop version before the application is opened, type `--devtools` after the file path.

<h3 align="center">SpaceShip App Demo Video</h3>

<p align="center">
  <a href="https://www.youtube.com/watch?v=bva3bA2iDBE">
    <img src="https://img.youtube.com/vi/bva3bA2iDBE/0.jpg" alt="SpaceShip App Demo" width="400">
  </a>
</p>

## Local development
> We recommend using a version manager as versions change very quickly. You will likely need to switch 
between multiple Node.js versions based on the needs of different projects you're working on. [NVM on windows](https://github.com/coreybutler/nvm-windows#installation--upgrades) on Windows and [nvm](https://github.com/nvm-sh/nvm) on Linux/macOS are pretty good choices. Also recommended nodejs version Hydrogen LTS (v18).

If you don't have nodejs, please install this:

https://nodejs.org/

If you don't have yarn installed on your computer, it is recommended that you install it:
```sh
npm install yarn -g
```

Execute the following commands to start a development server (or a Ionic environment):
```sh
yarn # Installs all dependencies
yarn start # Serve a development version
```

To build the web app:
```sh
yarn build # Compiles the app into the dist/ directory
```

If the first option fails, please try this one:
```sh
yarn build:8gb # Compiles the app into the dist/ directory
```

### Electron (Desktop)
> While you're using the app's dev mode, it's normal for the app to show that it's disconnected for a few seconds before fully loading the page. Notifications may not mute OS sound in application dev mode. The same thing can happen for notification click events to fail only in dev mode.

The application has only been tested on the Linux and Windows platform. But that won't stop you from trying to deploy to Mac.

Execute the following commands to start a development server (or a Ionic environment):
```sh
yarn # Installs all dependencies
yarn electron:start # Serve a development version
```

To build the desktop app:
```sh
yarn electron:build # Compiles the app into the release/ directory
```

### AppData

If you need to manage client files on your desktop version. You can find specific storage files in the directory below:

    %AppData%/spaceship-matrix/tinyMatrixData/

