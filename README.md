<p align="center">
  <br>
  <img alt="Logo" src="https://github.com/GitSquared/edex-ui/raw/master/media/logo.png" />
  <br><br><br>
</p>


Cleanness | Linux & MacOS | Windows | Dependencies
--------- | ------------- | ------- | ------------
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/93b816722c4e4af2bdf401b8187b8a2d)](https://www.codacy.com/app/GitSquared/edex-ui?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=GitSquared/edex-ui&amp;utm_campaign=Badge_Grade) | [![Build Status](https://travis-ci.org/GitSquared/edex-ui.svg?branch=master)](https://travis-ci.org/GitSquared/edex-ui) | [![Build status](https://ci.appveyor.com/api/projects/status/leb069bro8gwocu7/branch/master?svg=true)](https://ci.appveyor.com/project/GitSquared/edex-ui/branch/master) | [![Greenkeeper badge](https://badges.greenkeeper.io/GitSquared/edex-ui.svg)](https://greenkeeper.io/)  [![Known Vulnerabilities](https://snyk.io/test/github/gitsquared/edex-ui/badge.svg)](https://snyk.io/test/github/gitsquared/edex-ui)

eDEX-UI is a fullscreen desktop app ressembling a sci-fi computer interface, heavily inspired from [DEX-UI](https://github.com/seenaburns/dex-ui) and the [TRON Legacy movie effects](https://web.archive.org/web/20170511000410/http://jtnimoy.com/blogs/projects/14881671). It runs the shell of your choice in a real terminal, and displays live information about your system. It was made to be used on large touchscreens but will work nicely on a regular desktop computer or perhaps a tablet.

Technically speaking, it is a Node.js+Electron app with a pure HTML-CSS frontend. No frameworks included.

I had no ideas for a name so i took DEX-UI and added a "e" for Electron. Deal with it.

## Screenshots
![Pre-release screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_default.png)

_(htop running on eDEX-UI v0.9.0 with the default keyboard and theme)_

## Q&A
#### What OS can this thing run on?
Currently Windows, the latest MacOS and any linux distro that can run Chromium (AppImage package).
#### Is this a real terminal?
Yes. By default, eDEX runs bash on linux and Powershell on Windows, but you can change that to any command in the settings.json file.
#### I don't like the colors/the keyboard layout is not right for me!
We got you covered! Check the [repo's Wiki](https://github.com/GitSquared/edex-ui/wiki) for in-depth information about customizing eDEX.
#### Why is there a keyboard?
eDEX-UI is meant to be used on touchscreens, even if it works well on regular displays! If you have a physical keyboard wired to your computer, pressing keys IRL will illuminate the virtual keyboard: *please remember to not type any passwords if you are recording your screen!*
#### What's the difference between this and the original DEX-UI?
Seenaburns' DEX-UI was created _"as an experiment or an art piece, not distributable software"_. The goal of this project is to push Seena's vision forward by making such an interface usable in real-life scenarios.
#### Will using this make me insanely badass?
[Yes.](https://78.media.tumblr.com/35d4ef4447e0112f776b629bffd99188/tumblr_mk4gf8zvyC1s567uwo1_500.gif)


## Useful commands for the nerds
#### Starting from source:
on *nix systems (You'll need the Xcode command line tools on MacOS):
- clone the repository
- `npm run install-linux`
- `npm start`

on windows:
- start cmd or powershell **as administrator**
- clone the repository
- `npm run install-windows`
- `npm start`
#### Building
Note: Due to native modules, you can only compile binaries for the OS you are compiling from.
Note²: It is recommended to start building from a fresh clone to prevent the code minifier script from parsing an entire `node_modules` folder.

- make a fresh clone (recommended)
- `npm install` (NOT `install-linux` or `install-windows`)
- `npm run build-linux` or `build-windows` or `build-darwin`

Resulting binaries and assets will be in the `dist` folder.
