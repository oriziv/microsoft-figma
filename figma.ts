import * as Figma from "figma-js";
import theme =  require("figma-theme");
import * as fs from "fs" ;

export function camelCaseToDash( myStr: string ): string {
  return myStr.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
}

export function figmaToSass(fileId: string, token: string): void {
  console.log(fileId, token);
  const client: Figma.ClientInterface = Figma.Client({
    personalAccessToken: token
  });

  client.file(fileId).then( file => {
      const sass: any = theme(file.data);
      // create colors
      const colors: any = sass.colors;
      const colorsKeys: string[] = Object.keys(colors);
      colorsKeys.forEach(c => {
        const value: string = `${c}:${colors[c]};\n`;
        fs.appendFile(`_colors.scss`, value , (err: any) => {
          if (err) { throw err; }
        });
      });
      // create typo
      const textStyles: any = sass.textStyles;
      const textStylesKeys: string[] = Object.keys(textStyles);
      textStylesKeys.forEach(key => {
        const value: string = `@mixin ${key.replace(/^\$/g, "")} {\n`;
        fs.appendFileSync(`_typo.scss`, value);
        const cssRules: string[] = Object.keys(textStyles[key]);
        cssRules.forEach((r, i)=> {
          let val: string = `\t${camelCaseToDash(r)}: ${textStyles[key][r]};\n`;
          fs.appendFileSync(`_typo.scss`, val);
        });
        fs.appendFileSync(`_typo.scss`, "}\n");
      });
  });
}