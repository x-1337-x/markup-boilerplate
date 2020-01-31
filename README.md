# Markup boiler plate sandbox

## structure

```
dist/           - gulp build destination (builds automaticaly)
src/            - gulp dev source files
  html/         - html-templates which can use @@import to make some templates
    includes/   - html-includes u import into the html-templates
  preview/      - pre-built html files from templates u can view in browser
  static/       - all html-related files
    js/         - scripts
    css/        - styles pre-built from scss sources
    scss/       - actual styles
    i/          - images
      icons/    - all these files will be built in sprite.png
    fonts/      - fonts
.gitignore      - git ignore
bower.json      - bower packages
package.json    - npm packages
```

## install

```
npm i
bower i
```

## dev

```
gulp dev
```

## build

```
gulp build
```