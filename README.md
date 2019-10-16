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
  <a href="https://github.com/GitSquared/edex-ui/releases/download/v2.2.2/eDEX-UI.Windows.Installer.exe" target="_blank"><img alt="undefined" src="https://badgen.net/badge/Download/Windows/?color=blue&icon=windows&label"></a>
  <a href="https://github.com/GitSquared/edex-ui/releases/download/v2.2.2/eDEX-UI.MacOS.Image.dmg" target="_blank"><img alt="undefined" src="https://badgen.net/badge/Download/macOS/?color=grey&icon=apple&label"></a>
  <a href="https://github.com/GitSquared/edex-ui/releases/download/v2.2.2/eDEX-UI.Linux.x86_64.AppImage" target="_blank"><img alt="undefined" src="https://badgen.net/badge/Download/Linux64/?color=orange&icon=terminal&label"></a>
  <a href="https://github.com/GitSquared/edex-ui/releases/download/v2.2.2/eDEX-UI.Linux.i386.AppImage" target="_blank"><img alt="undefined" src="https://badgen.net/badge/Download/Linux32/?color=orange&icon=terminal&label"></a>
  <a href="https://aur.archlinux.org/packages/edex-ui" target="_blank"><img alt="undefined" src="https://badgen.net/badge/AUR/Package/cyan"></a>
  <br><br><br>
</p>


eDEX-UI is a fullscreen, cross-platform terminal emulator and system monitor that looks and feels like a sci-fi computer interface.

Heavily inspired from the [TRON Legacy movie effects](https://web.archive.org/web/20170511000410/http://jtnimoy.com/blogs/projects/14881671) (especially the [Board Room sequence](https://gmunk.com/TRON-Board-Room)), the eDEX-UI project was originally meant to be *"[DEX-UI](https://github.com/seenaburns/dex-ui) with less « art » and more « distributable software »"*. While keeping a futuristic look and feel, it strives to maintain a certain level of functionality and to be usable in real-life scenarios, with the larger goal of bringing science-fiction UXs to the mainstream.

It might or might not be a joke taken too seriously.

*( Jump to: [Screenshots](#screenshots) - [Questions & Answers](#qa) - **[Download](#how-do-i-get-it)** - [Featured In](#featured-in) - [Developer Instructions](#useful-commands-for-the-nerds) - [Credits](#credits) )*

## Features
- Fully featured terminal emulator with tabs, colors, mouse events, and support for `curses` and `curses`-like applications.
- Real-time system (CPU, RAM, swap, processes) and network (GeoIP, active connections, transfer rates) monitoring.
- Full support for touch-enabled displays, including an on-screen keyboard.
- Directory viewer that follows the CWD (current working directory) of the terminal.
- Advanced customization using themes, on-screen keyboard layouts, CSS injections. See the [wiki](https://github.com/GitSquared/edex-ui/wiki) for more info.
- Optional sound effects made by a talented sound designer for maximum hollywood hacking vibe.

## Screenshots
![Default screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_default.png)

_([neofetch](https://github.com/dylanaraps/neofetch) on eDEX-UI 2.2 with the default "tron" theme & QWERTY keyboard)_

![Interstellar screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_white.png)

_(Graphical settings editor and list of keyboard shortcuts on eDEX-UI 2.2 with the "interstellar" bright theme)_

![Disrupted screenshot](https://github.com/GitSquared/edex-ui/raw/master/media/screenshot_disrupted.png)

_([cmatrix](https://github.com/abishekvashok/cmatrix) on eDEX-UI 2.2 with the experimental "tron-disrupted" theme, and the user-contributed DVORAK keyboard)_

## Q&A
#### How do I get it?
Click on the little badges under the eDEX logo at the top of this page, or go to the [Releases](https://github.com/GitSquared/edex-ui/releases) tab, or download it through [one of the available repositories](https://repology.org/project/edex-ui/versions) (Homebrew, AUR...).

Public release binaries are unsigned ([why](https://gaby.dev/posts/code-signing)). On Linux, you will need to `chmod +x` the AppImage file in order to run it.
#### I have a problem!
Search through the [Issues](https://github.com/GitSquared/edex-ui/issues) to see if yours has already been reported. If you're confident it hasn't been reported yet, feel free to open up a new one. If you see your issue and it's been closed, it probably means that the fix for it will ship in the next version, and you'll have to wait a bit.
#### Can you disable the keyboard/the filesystem display?
You can't disable them (yet) but you can hide them. See the `tron-notype` theme.
#### Why is the file browser saying that "Tracking Failed"? (Windows only)
On Linux and macOS, eDEX tracks where you're going in your terminal tab to display the content of the current folder on-screen.
Sadly, this is technically impossible to do on Windows right now, so the file browser reverts back to a "detached" mode. You can still use it to browse files & directories and click on files to input their path in the terminal.
#### eDEX seems to be pretty stable now. What are you planning to do next?
I'm not done with this software just yet. I'm actively working on exciting new features that will make eDEX less of a gadget and more of a usable sysadmin tool. Notably, I'm researching remote monitoring, multi-monitor support, and a plug-in system which would externalize the module structure used internally.
#### Is this repo actively maintained?
![Yes.](https://img.shields.io/github/last-commit/GitSquared/edex-ui.svg?style=popout)
#### How did you make this?
Glad you're interested! See [#272](https://github.com/GitSquared/edex-ui/issues/272).
#### This is so cool.
Thanks! If you feel like it, you can [buy me a coffee](https://buymeacoff.ee/gaby) to encourage me to build more awesome stuff.

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
- [Telegram Channel "Веб-страница" (Web Page)](https://t.me/tproger_web/329)


## Useful commands for the nerds

**IMPORTANT NOTE:** the following instructions are meant for running eDEX from the latest unoptimized, unreleased, development version. If you'd like to get stable software instead, refer to [these](#how-do-i-get-it) instructions.

#### Starting from source:
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
Note: Due to native modules, you can only build targets for the host OS you are using.

- `npm install` (NOT `install-linux` or `install-windows`)
- `npm run build-linux` or `build-windows` or `build-darwin`

The script will minify the source code, recompile native dependencies and create distributable assets in the `dist` folder.

#### A note about versioning, branches, and commit messages
Currently, development is done directly on the `master` branch. The version tag on this branch is the version tag of the next release with the `-pre` suffix (e.g `v2.6.1-pre`), to avoid confusion when both release and source versions are installed on one's system.

I use [gitmoji](https://github.com/carloscuesta/gitmoji-cli) to make my commit messages, but I'm not enforcing this on this repo so commits from PRs and the like might not be formatted that way.

[Dependabot](https://dependabot.com) runs weekly to check dependencies updates. It is setup to auto-merge most of them as long as the builds checks passes.

## Credits
eDEX-UI's source code was primarily written by me, [Squared](https://github.com/GitSquared). If you want to get in touch with me or find other projects I'm involved in, check out [my website](https://squared.codebrew.fr).

[PixelyIon](https://github.com/PixelyIon) helped me get started with Windows compatibility and offered some precious advice when I started to work on this project seriously.

[IceWolf](https://soundcloud.com/iamicewolf) composed the sound effects on v2.1.x and above. He makes really cool stuff, check out his music!

## Thanks
Of course, eDEX would never have existed if I hadn't stumbled upon the amazing work of [Seena](https://github.com/seenaburns) on [r/unixporn](https://reddit.com/r/unixporn).

This project uses a bunch of open-source libraries, frameworks and tools, see [the full dependency graph](https://github.com/GitSquared/edex-ui/network/dependencies).

I want to namely thank the developers behind [xterm.js](https://github.com/xtermjs/xterm.js), [systeminformation](https://github.com/sebhildebrandt/systeminformation) and [SmoothieCharts](https://github.com/joewalnes/smoothie).

Huge thanks to [Rob "Arscan" Scanlon](https://github.com/arscan) for making the fantastic [ENCOM Globe](https://github.com/arscan/encom-globe), also inspired by the TRON: Legacy movie, and distributing it freely. His work really puts the icing on the cake.

## Licensing

Licensed under the [GPLv3.0](https://github.com/GitSquared/edex-ui/blob/master/LICENSE).

[![FOSSA Status](https://app.fossa.io/api/projects/custom%2B5687%2Fgithub.com%2FGitSquared%2Fedex-ui.svg?type=large)](https://app.fossa.io/projects/custom%2B5687%2Fgithub.com%2FGitSquared%2Fedex-ui?ref=badge_large)
