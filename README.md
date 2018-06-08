<p align="center">
  <br>
  <img alt="Icon" src="https://github.com/GitSquared/edex-ui/raw/master/media/linuxIcons/128x128.png" />
  <br><br><br><br>
</p>


Cleanness | Linux & MacOS | Windows | Dependencies
--------- | ------------- | ------- | ------------
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/93b816722c4e4af2bdf401b8187b8a2d)](https://www.codacy.com/app/GitSquared/edex-ui?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=GitSquared/edex-ui&amp;utm_campaign=Badge_Grade) | [![Build Status](https://travis-ci.org/GitSquared/edex-ui.svg?branch=master)](https://travis-ci.org/GitSquared/edex-ui) | [![Build status](https://ci.appveyor.com/api/projects/status/leb069bro8gwocu7/branch/master?svg=true)](https://ci.appveyor.com/project/GitSquared/edex-ui/branch/master) | [![Greenkeeper badge](https://badges.greenkeeper.io/GitSquared/edex-ui.svg)](https://greenkeeper.io/)  [![Known Vulnerabilities](https://snyk.io/test/github/gitsquared/edex-ui/badge.svg)](https://snyk.io/test/github/gitsquared/edex-ui)

eDEX-UI is a sci-fi interactive terminal interface heavily inspired from [DEX-UI](https://github.com/seenaburns/dex-ui) and the [TRON Legacy movie effects](https://web.archive.org/web/20170511000410/http://jtnimoy.com/blogs/projects/14881671), made cross-platform and easy to install with [Electron](https://github.com/electron/electron).

I had no ideas for a name so i took DEX-UI and added a "e" for Electron. Deal with it.

## FAQ
#### What OS can this thing run on?
Currently Windows (portable binary), the latest MacOS (.dmg and pkg) and any linux distro that can run Chromium (AppImage and tarball).
#### Is this a real terminal?
Yes. By default, eDEX runs bash on linux and Powershell on Windows, but you can change that to any command in the settings.json file.
#### Why is there a keyboard?
As DEX-UI's author said, it's there mostly because it looks cool, but in eDEX it's also a fully-capable tactile keyboard.
#### What's the difference between this and the original DEX-UI?
Seenaburns' DEX-UI was created _"as an experiment or an art piece, not distributable software"_.
My goal with eDEX is to create a similar experience, but easier to install, run, and use.
#### Will using this make me insanely badass?
[Yes.](https://78.media.tumblr.com/35d4ef4447e0112f776b629bffd99188/tumblr_mk4gf8zvyC1s567uwo1_500.gif)


## How to run it from source?
on *nix systems (You'll need the Xcode command line tools on MacOS):
- clone the repository
- `npm run install-linux`
- `npm start`

on windows:
- start cmd or powershell **as administrator**
- clone the repository
- `npm run install-windows`
- `npm start`


## Screenshots
![Pre-release screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot1.png)

_(tmux running htop and systemctl status, on eDEX-UI v0.7.3 with the "red theme")_
