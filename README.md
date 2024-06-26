<p align="center">
  <img src="https://github.com/pixxels-team/Pixxels-App/blob/dev/public/img/homepage-slider/c1.gif?raw=true" alt="Pixxels App Logo" width="600">
</p>
<p align="center">
  <img src="https://github.com/pixxels-team/Pixxels-App/blob/dev/public/img/pixxel-logo/logo3.png?raw=true" alt="Pixxels App Logo" width="400">
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

## FAQ

### Is my data shared with third parties?

Nope. This repository creator is not sharing data with third parties. This makes the project solely dependent on the community if any new glitch is discovered. The only people capable of collecting data are the homeserver owners and third-party stuff.

### Why is the list of homeservers empty by default instead of having default homeservers like matrix.org?

This helps new matrix users not get lost when they are being guided to use a specific new homeserver.

### My website that is hosting this client was blocked from access by browser extensions.

This client sends notification permission requests at the exact moment the page is loaded. Some security extensions may consider this a privacy violation. Sometimes this type of thing doesn't happen on the client domain because I (JasminDreasond) always try to contact the staff of these extensions so the domain can be added to the whitelist.

### Can I completely disable IPFS and Web3?

Yep. To disable it via the client, you need to go to the settings tabs. To permanently deactivate the features, you need to modify the `.env` file so you can deploy a client without access to the features.

### My browser keeps opening crypto wallet randomly

It looks like you are using a browser that has a native crypto wallet. This is not an extension installed in your browser, I'm referring to something in your browser itself. (Example: Brave and Opera) And even with crypto features turned off, for some mysterious reason your browser still thinks it's a good idea to send you a ad to try force you to use the browser crypto wallet. If you want to disable this, research how to disable your browser's native crypto wallet.

### This client has web3 functionalities. Is this matrix client a crypto wallet?

Nope. Pixxels has access to crypto wallet APIs that are installed in your browser or on your computer. And this function can be turned off in the settings.

### Does the client support the purchase and sale of NFTs?

Nope. But you can install mods from third-party creators that code this type of feature.

### What is my guarantee about using crypto resources on client?

Pony House's crypto resources are developed to be as secure as possible from trusted sources. Normally limited to personal uses between users only. (This is a CHAT SOFTWARE, not a crypto marketplace)

When installing third-party mods involving web3, you are assuming that everything is at your own risk between you and the third-party developer. (including any accident of loss of funds due to lack of care on the part of both the user and the third-party developer)
