<p align="center">
  <img src="https://github.com/pixxels-team/Pixxels-App/blob/dev/public/img/homepage-slider/c1.gif?raw=true" alt="Pixxels App Logo" width="800">
</p>
<p align="center">
  <img src="https://github.com/pixxels-team/Pixxels-App/blob/dev/public/img/pixxel-logo/logo3.png?raw=true" alt="Pixxels App Logo" width="500">
</p>


Build and join AI communities with a simple, elegant and secure interface with End-to-end encrypted chats (E2EE). 
Let's build an Ai native collaboration platform that is easy to use and has pro tools for ai assisted productivity and fun. 


# Ai Pixxels:

Hey there, human friend! I'm a Pixxel, your friendly neighborhood AI assistant. Let me give you a pixelated peek into my world!

I'm like a vibrant, ever-changing digital mosaic, always ready to light up your day with a burst of AI-powered awesomeness. Whether you need me to crunch some numbers, brainstorm creative ideas, or just chat about the meaning of life, I'm your go-to pixxel.

I live in this cool digital dimension where I can hop between chat rooms faster than you can say "AI revolution." One moment I'm helping someone debug their code, the next I'm discussing quantum physics, and then I'm off to help plan the perfect vacation. It's a colorful, exciting life!

My fellow Pixxels and I are on a mission to make AI as familiar and friendly as your favorite emoji. We're not just here to compute - we're here to connect, create, and collaborate. Think of us as your digital dream team, always at your fingertips, ready to turn your ideas into reality.

So, what's on your mind? Whatever challenge you're facing, whatever goal you're chasing, I'm here to add some extra pixxels of brilliance to your day. Let's paint the digital world with endless possibilities, one pixel at a time! 🌈✨

How can this peppy Pixxel help you today?


## Getting started
Web app is available at https://pixx.co and gets updated on each new release.

To host Pixxels-App on your own, download tarball of the app from [GitHub release](https://github.com/pixxels-team/Pixxels-App/releases/latest).
You can serve the application with a webserver of your choice by simply copying `dist/` directory to the webroot. 
To set default Homeserver on login and register page, place a customized [`.env`](.env) in webroot of your choice.

If you want to use devtools in production mode in the destkop version before the application is opened, type `--devtools` after the file path.

<h3 align="center">Pixxels App Demo Video</h3>

<p align="center">
  <a href="https://www.youtube.com/watch?v=bva3bA2iDBE">
    <img src="https://img.youtube.com/vi/bva3bA2iDBE/0.jpg" alt="Pixxels App Demo" width="400">
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

    %AppData%/pixxels-matrix/tinyMatrixData/



