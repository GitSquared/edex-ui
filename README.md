<p align="center">
  <br>
  <img alt="Logo" src="https://github.com/GitSquared/edex-ui/raw/master/media/logo.png">
  <br><br>
  <a href="https://lgtm.com/projects/g/GitSquared/edex-ui/context:javascript"><img alt="undefined" src="https://img.shields.io/lgtm/grade/javascript/g/GitSquared/edex-ui.svg?logo=lgtm&logoWidth=18"/></a>
  <br>
  <a href="https://github.com/GitSquared/edex-ui/releases/latest"><img alt="undefined" src="https://img.shields.io/github/release/GitSquared/edex-ui.svg?style=popout"></a>
  <a href="#featured-in"><img alt="undefined" src="https://img.shields.io/github/downloads/GitSquared/edex-ui/total.svg?style=popout"></a>
  <a href="https://github.com/GitSquared/edex-ui/blob/master/LICENSE"><img alt="undefined" src="https://img.shields.io/github/license/GitSquared/edex-ui.svg?style=popout"></a>
  <br>
  <a href="https://github.com/GitSquared/edex-ui/releases/download/v2.0.1/eDEX-UI.Windows.Installer.exe" target="_blank"><img alt="undefined" src="https://badgen.net/badge//Windows/blue?icon=windows"></a>
  <a href="https://github.com/GitSquared/edex-ui/releases/download/v2.0.1/eDEX-UI.MacOS.Image.dmg" target="_blank"><img alt="undefined" src="https://badgen.net/badge//macOS/grey?icon=apple"></a>
  <a href="https://github.com/GitSquared/edex-ui/releases/download/v2.0.1/eDEX-UI.Linux.x86_64.AppImage" target="_blank"><img alt="undefined" src="https://badgen.net/badge//Linux64/orange?icon=terminal"></a>
  <a href="https://github.com/GitSquared/edex-ui/releases/download/v2.0.1/eDEX-UI.Linux.i386.AppImage" target="_blank"><img alt="undefined" src="https://badgen.net/badge//Linux32/orange?icon=terminal"></a>
  <a href="https://aur.archlinux.org/packages/edex-ui" target="_blank"><img alt="undefined" src="https://badgen.net/badge/AUR/Package/cyan"></a>
  <br><br><br>
</p>


eDEX-UI is a fullscreen, cross-platform terminal emulator and system monitor that looks and feels like a sci-fi computer interface.

Heavily inspired from the [TRON Legacy movie effects](https://web.archive.org/web/20170511000410/http://jtnimoy.com/blogs/projects/14881671), the eDEX-UI project was originally meant to be *"[DEX-UI](https://github.com/seenaburns/dex-ui) with less « art » and more « distributable software »"*. While keeping a futuristic look and feel, it strives to maintain a certain level of functionality and to be usable in real-life scenarios, with the larger goal of bringing science-fiction UXs to the mainstream.

It might or might not be a joke taken too seriously.

*( Jump to: [Screenshots](#screenshots) - [Questions & Answers](#qa) - [Featured In](#featured-in) - [Developer Instructions](#useful-commands-for-the-nerds) - [Credits](#credits) - [Thanks](#thanks) )*

## Features
- Fully featured terminal emulator with tabs, colors, mouse events, and support for `curses` and `curses`-like applications.
- Real-time system (CPU, RAM, processes) and network (GeoIP, active connections, transfer rates) monitoring.
- Full support for touch-enabled displays, including an on-screen keyboard.
- Directory viewer that follows the CWD (current working directory) of the terminal.
- Advanced customization using themes, on-screen keyboard layouts, CSS injections. See the [wiki](https://github.com/GitSquared/edex-ui/wiki) for more info.

## Screenshots
![Default screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_default.png)

_([neofetch](https://github.com/dylanaraps/neofetch) on eDEX-UI 2.0 with the default "tron" theme & QWERTY keyboard)_

![Nord screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_nord.png)

_(Graphical settings editor on eDEX-UI 2.0 with the "nord" colorful theme)_

![Disrupted screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_disrupted.png)

_([fx](https://github.com/antonmedv/fx) showing the results of a [ipapi](https://github.com/GitSquared/ipapi) query on eDEX-UI 2.0 with the experimental "tron-disrupted" theme, and the user-contributed DVORAK keyboard)_

## Q&A
#### Where can I find download links?
Click on the little badges under the eDEX logo at the top of this page, or go to the [Releases](https://github.com/GitSquared/edex-ui/releases) tab.
#### I have a problem!
Search through the [Issues](https://github.com/GitSquared/edex-ui/issues) to see if yours has already been reported. If you're confident it hasn't been reported yet, feel free to open up a new one. If you see your issue and it's been closed, it probably means that the fix for it will ship in the next version, and you'll have to wait a bit.
#### Can you disable the keyboard/the filesystem display?
You can't disable them (yet) but you can hide them. See the `tron-notype` theme.Thank you for supporting 🎉 SAILLARD Gabriel
#### Are PRs welcome?
They are!
#### Is this repo actively maintained?
![Yes.](https://img.shields.io/github/last-commit/GitSquared/edex-ui.svg?style=popout)
#### How did you make this?
Glad you're interested! See #272.
#### This is so cool.
Thanks!

<img width="220" src="https://78.media.tumblr.com/35d4ef4447e0112f776b629bffd99188/tumblr_mk4gf8zvyC1s567uwo1_500.gif" />


## Featured in...
- [Linux Uprising Blog](https://www.linuxuprising.com/2018/11/edex-ui-fully-functioning-sci-fi.html)
- [My post on r/unixporn](https://www.reddit.com/r/unixporn/comments/9ysbx7/oc_a_little_project_that_ive_been_working_on/)
- [Korben article (in french)](https://korben.info/une-interface-futuriste-pour-vos-ecrans-tactiles.html)
- [Hacker News](https://news.ycombinator.com/item?id=18509828)
- [This tweet that made me smile](https://twitter.com/mikemaccana/status/1065615451940667396)
- [BoingBoing article](https://boingboing.net/2018/11/23/simulacrum-sf.html) - Apparently i'm a "French hacker"
- [OReilly 4 short links](https://www.oreilly.com/ideas/four-short-links-23-november-2018)
- [Hackaday](https://hackaday.com/2018/11/23/look-like-a-movie-hacker/)
- [Developpez.com (another french link)](https://www.developpez.com/actu/234808/Une-application-de-bureau-ressemble-a-une-interface-d-ordinateur-de-science-fiction-inspiree-des-effets-du-film-TRON-Legacy/)
- [GitHub Blog's Release Radar November 2018](https://blog.github.com/2018-12-21-release-radar-november-2018/)
- [opensource.com Productive Tools for 2019](https://opensource.com/article/19/1/productivity-tool-edex-ui)


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
