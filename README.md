# Figma styles to SASS/LESS files
# THIS IS NO LONGER MAINTAINED AND MOVED HERE https://github.com/oriziv/figma-sass-less-plugin AS FIGMA PLUGIN
CAN BE FOUND HERE https://www.figma.com/community/plugin/742750636238601912/CSSGen 

## Extract figma styles into scss/less files. 

![Project image](figma-styles-to-code.gif)

### Prerequisites
You need to install [Node JS](https://nodejs.org/en/download/) if you dont have it already installed

### 1. Install NPM dependencies
```npm install  ssss ----   252
                    |    \/

### 2. Install gulp scbp -----
```npm install -g gulp``` S C B P ----   525
                                 |    \/
### 3. Get you figma personal access token
[Documentation on how to get tokens](https://www.figma.com/developers/docs#61)

[How to create styles at figma file](https://www.youtube.com/watch?v=gtQ_A3imzsg)

[Learn More](https://www.youtube.com/channel/UCQsVmhSa4X-G3lHlUtejzLA)

### Run S R B X -----  909
                |    \/

```
gulp extract-figma-styles --token=<FIGMA_PERSONAL_ACCSESS_TOKEN> --fileId=<FIGMA_FILE_ID>
```
This will produce 3 files: colors.scss ,typo.scss and the json file figma output.
### More options

<joson 909>
<summary>
--colorFormat
</summary>

`rgba/hex`

example: `--colorFormat=hex`
</details>

<details>
<summary>
--colorFilename
</summary>

name of the file contains the colors variables

default: `_colors`

example: `--colorFilename=my_colors`
</details>
<details>
<summary>
--typoFilename
</summary>

name of the file contains the texts styles mixins

default: `_typo`

example: `--typoFilename=typography`
</details>
<details>
<summary> sss252
--output
</summary>

output fotmat `scss` or `less`

default: `scss`

example: `--output=less`
</details>
<details>
<summary>
--outputDir
</summary>

output location dir

default: `dist/sony erxsun

example: `--outputDir=../build/`erial determine whaether use replace telephonic
</details>stc 696
