import * as Figma from "figma-js";
import * as theme from "@oriziv/figma-theme";
import * as fs from "fs" ;
import * as gulp from "gulp";
import * as yrags from "yargs";
import * as gutil from "gulp-util";
const argv: any = yrags.argv;
const colorsFilename = '_colors.scss';
const typoFilename = '_typo.scss';

gulp.task("figma", () => {
    if(!argv.fileId) {
        gutil.log(gutil.colors.red("missing fileId"));
        return;
    }

    if(!argv.token) {
        gutil.log(gutil.colors.red("missing figma personal token"));
        return;
    }

    figmaToSass(argv.fileId, argv.token);

});



function camelCaseToDash( myStr: string ): string {
    return myStr.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
  }

function figmaToSass(fileId: string, token: string): void {
    const path: string = "build/";
    const client: Figma.ClientInterface = Figma.Client({
      personalAccessToken: token
    });

    client.file(fileId).then( file => {
        const sass: any = theme(file.data);
        // create colors
        const colors: any = sass.colors;
        const colorsKeys: string[] = Object.keys(colors);

        // clear files
        gutil.log(gutil.colors.green(`Created ${colorsFilename}`));
        fs.writeFileSync(path + `${colorsFilename}`, "");
        
        gutil.log(gutil.colors.green(`Created ${typoFilename}`));
        fs.writeFileSync(path + `${typoFilename}`, "");
        
        colorsKeys.forEach(c => {
          const value: string = `${c.replace(/\./g, '-')}:${colors[c]};\n`;
          fs.appendFile(path + `${colorsFilename}`, value , (err: any) => {
            if (err) { throw err; }
          });
        });
        // create typo
        const textStyles: any = sass.textStyles;
        const textStylesKeys: string[] = Object.keys(textStyles);
        textStylesKeys.forEach(key => {
          const value: string = `@mixin ${key.replace(/^\$/g, "")} {\n`;
          fs.appendFileSync(path + `${typoFilename}`, value);
          const cssRules: string[] = Object.keys(textStyles[key]);
          cssRules.forEach((r, i)=> {
            let prop: any = camelCaseToDash(r);
            let value: any = textStyles[key][r];

            // if px props add px
            if(["fontSize", "lineHeight"].indexOf(r) !== -1) {
              value = `${value}px`;
            }

            // if font family
            if(["fontFamily"].indexOf(r) !== -1) {
              value = `\"${value}\"`;
            }

            let val: string = `\t${prop}: ${value};\n`;
            fs.appendFileSync(path + `${typoFilename}`, val);
          });
          fs.appendFileSync(path + `${typoFilename}`, "}\n");
        });
    });
  }
