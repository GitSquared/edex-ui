<p align="center">
  <br>
  <img alt="Logo" src="https://github.com/GitSquared/edex-ui/raw/master/media/logo.png" />
  <br><br><br>
</p>


Download | Linux & macOS | Windows | Dependencies | Build system | Source
-------- | ------------- | ------- | ------------ | ------------ | ------
[![Release Badge](https://badgen.net/github/release/GitSquared/edex-ui)](https://github.com/GitSquared/edex-ui/releases) | [![Build Status](https://travis-ci.org/GitSquared/edex-ui.svg?branch=master)](https://travis-ci.org/GitSquared/edex-ui) | [![Build status](https://ci.appveyor.com/api/projects/status/leb069bro8gwocu7/branch/master?svg=true)](https://ci.appveyor.com/project/GitSquared/edex-ui/branch/master) | [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=GitSquared/edex-ui)](https://dependabot.com) | [![Known Vulnerabilities](https://snyk.io/test/github/GitSquared/edex-ui/badge.svg?targetFile=package.json)](https://snyk.io/test/github/GitSquared/edex-ui?targetFile=package.json) | [![Known Vulnerabilities](https://snyk.io/test/github/GitSquared/edex-ui/badge.svg?targetFile=src%2Fpackage.json)](https://snyk.io/test/github/GitSquared/edex-ui?targetFile=src%2Fpackage.json)

Download 1.0.1: [for Windows](https://github.com/GitSquared/edex-ui/releases/download/v1.1.0/eDEX-UI.Windows.Installer.exe) | [for macOS](https://github.com/GitSquared/edex-ui/releases/download/v1.1.0/eDEX-UI.MacOS.Image.dmg) | [for Linux x32](https://github.com/GitSquared/edex-ui/releases/download/v1.1.0/eDEX-UI.Linux.i386.AppImage) | [for Linux x64](https://github.com/GitSquared/edex-ui/releases/download/v1.1.0/eDEX-UI.Linux.x86_64.AppImage)

eDEX-UI is a fullscreen desktop application resembling a sci-fi computer interface, heavily inspired from [DEX-UI](https://github.com/seenaburns/dex-ui) and the [TRON Legacy movie effects](https://web.archive.org/web/20170511000410/http://jtnimoy.com/blogs/projects/14881671). It runs the shell of your choice in a real terminal, and displays live information about your system. It was made to be used on large touchscreens but will work nicely on a regular desktop computer or perhaps a tablet PC or one of those funky 360° laptops with touchscreens.

I had no ideas for a name so i took DEX-UI and added a "e" for Electron. Deal with it.

([Official ArchLinux AUR package](https://aur.archlinux.org/packages/edex-ui/) maintained by [@JesusCrie](https://github.com/JesusCrie))

## Screenshots
![Default screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_default.png)

_([neofetch](https://github.com/dylanaraps/neofetch) on eDEX-UI 1.0 with the default "tron" theme & QWERTY keyboard)_

![Blade screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_blade.png)

_([browsh](https://github.com/browsh-org/browsh) showing the results of a DuckDuckGo image search on eDEX-UI 1.0 with the "blade" theme & AZERTY keyboard)_

![Disrupted screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_disrupted.png)

_([fx](https://github.com/antonmedv/fx) showing the results of a [ipapi](https://github.com/GitSquared/ipapi) query on eDEX-UI 1.0 with the experimental "tron-disrupted" theme, and the French AZERTY keyboard)_

## Q&A
#### What OS can this thing run on?
Currently Windows, the latest macOS and any Linux distro that can run Chromium (AppImage package).
#### Is this a real terminal?
Yes. By default, eDEX runs bash on Linux and Powershell on Windows, but you can change that to any command in the settings.json file.
#### I don't like the colors/the keyboard layout is not right for me!
We got you covered! Check the [repo's Wiki](https://github.com/GitSquared/edex-ui/wiki) for in-depth information about customizing eDEX.
#### Why is there a keyboard?
eDEX-UI is meant to be used on touchscreens, even if it works well on regular displays! If you have a physical keyboard wired to your computer, pressing keys IRL will illuminate the virtual keyboard: *please remember to not type any passwords if you are recording your screen!*
#### What's the difference between this and the original DEX-UI?
Seenaburns' DEX-UI was created _"as an experiment or an art piece, not distributable software"_. The goal of this project is to push Seena's vision forward by making such an interface usable in real-life scenarios.
#### Will using this make me insanely badass?
Yes.

<img width="220" src="https://78.media.tumblr.com/35d4ef4447e0112f776b629bffd99188/tumblr_mk4gf8zvyC1s567uwo1_500.gif" />


## Featured in...
- [Linux Uprising Blog](https://www.linuxuprising.com/2018/11/edex-ui-fully-functioning-sci-fi.html)
- [My post on r/unixporn](https://www.reddit.com/r/unixporn/comments/9ysbx7/oc_a_little_project_that_ive_been_working_on/)
- [Korben article (in french)](https://korben.info/une-interface-futuriste-pour-vos-ecrans-tactiles.html)
- [Hacker News](https://news.ycombinator.com/item?id=18509828)
- [This tweet that made me smile](https://twitter.com/mikemaccana/status/1065615451940667396)
- [BoingBoing article](https://boingboing.net/2018/11/23/simulacrum-sf.html) - Apparently i'm a "French hacker" lol
- [OReilly 4 short links](https://www.oreilly.com/ideas/four-short-links-23-november-2018)
- [Hackaday](https://hackaday.com/2018/11/23/look-like-a-movie-hacker/)
- [Developpez.com (another french link)](https://www.developpez.com/actu/234808/Une-application-de-bureau-ressemble-a-une-interface-d-ordinateur-de-science-fiction-inspiree-des-effets-du-film-TRON-Legacy/)


## Useful commands for the nerds
#### Starting from source:

**IMPORTANT NOTE:** the following instructions are meant **for DEVELOPERS ONLY**. If you're just a casual user please download the precompiled binaries available on the [Releases tab](https://github.com/GitSquared/edex-ui/releases).

on *nix systems (You'll need the Xcode command line tools on macOS):
- clone the repository
- `npm run install-linux`
- `npm start`

on Windows:
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

## Credits
eDEX-UI's source code was primarily written by me, [Squared](https://github.com/GitSquared). If you want to get in touch with me or find other projects I'm involved in, check out [my website](https://squared.codebrew.fr).

[PixelyIon](https://github.com/PixelyIon) helped me get started with Windows compatibility and offered some precious advice when I started to work on this project seriously.

## Thanks
Of course, eDEX would never have existed if I hadn't stumbled upon the amazing work of [Seena](https://github.com/seenaburns) on [r/unixporn](https://reddit.com/r/unixporn).

This project uses a bunch of open-source libraries, frameworks and tools, see [the full dependency graph](https://github.com/GitSquared/edex-ui/network/dependencies).

I want to namely thank the developers behind [xterm.js](https://github.com/xtermjs/xterm.js), [systeminformation](https://github.com/sebhildebrandt/systeminformation) and [SmoothieCharts](https://github.com/joewalnes/smoothie).

Huge thanks to [Rob "Arscan" Scanlon](https://github.com/arscan) for making the fantastic [ENCOM Globe](https://github.com/arscan/encom-globe), also inspired by the TRON: Legacy movie, and distributing it freely. His work really puts the icing on the cake.
