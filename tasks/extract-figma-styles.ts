import * as Figma from 'figma-api';
import { log, error, getColorValue, formatToCSS, camelCaseToDash, getVariablePrefix, getMixinPrefix, formatVariable } from "../utils";
import * as yrags from "yargs";
import * as fs from "fs" ;
import { IOutputStyle, OutputFormat } from './interfaces';
const argv: any = yrags.argv;

export async function extractFigmaStyles(): Promise<any> {
    const token = argv.token;
    const fileId = argv.fileId;

    // Input check
    if(!token || !fileId) {
        error('Please provide fileId and personal access token');
        return;
        
    }
    // Create API instance
    const api = new Figma.Api({
        personalAccessToken: token,
    });
    
    
    try {
        log(`Getting figma file ${fileId} from figma api`);
        const [ err, file ] = await api.getFile(argv.fileId);
        if (file) {
            log(`Got file`);
            const vars: IOutputStyle = {fills: {},textStyles: {}};
            const styles = file.styles;
            walkFigmaTree(file.document, vars, styles);

            // Create colors file
            const path: string = argv.outputDir || "dist/";
            const fileFormat = argv.output || 'scss';
            const colorsFilename = argv.colorFilename ? `${argv.colorFilename}.${fileFormat}` : `_colors.${fileFormat}`;
            const typoFilename = argv.typoFilename ? `${argv.typoFilename}.${fileFormat}` : `_typo.${fileFormat}`;
            
            // Create files
            if (!fs.existsSync(path)){
                fs.mkdirSync(path);
            }
            fs.writeFileSync(path + 'file.json', JSON.stringify(file));
            fs.writeFileSync(path + `${colorsFilename}`, "");
            fs.writeFileSync(path + `${typoFilename}`, "");
            
            // Fullfil colors file
            log(`Creating ${colorsFilename}`);
            createColorsVariables(vars, `${path}${colorsFilename}`, argv.output);
            
            // Fullfil text styles sass mixins
            log(`Creating ${typoFilename}`);
            createStyleMixins(vars,`${path}${typoFilename}`, argv.output);

        }

    } catch(e) {
        error(e);
    }
}


// Walk the figma tree recursively and get the styles
function walkFigmaTree(node: Figma.Node<any>, vars: IOutputStyle, styles: any) {
    if(!node) {
        return;
    }
    
    // Check node stuff
    if(node.styles) {
        const fills: Figma.Paint[] = node.fills;
        const style: Figma.TypeStyle = node.style;
        
        if(fills && fills.length) {
            // has css properties
            fills.forEach(fill => {
                // Check for fill style
                if(!fill.color) {
                    return;
                }
                const colorFormat = argv.colorFormat || 'rgba';
                if(fill.opacity) {
                    fill.color.a = Math.round(fill.opacity * 100) / 100;
                }
                const rgbaColor = getColorValue(fill.color, colorFormat);
                const styleKeys = Object.keys(node.styles);
                styleKeys.forEach((styleType: any) => {
                    const styleRef = styles[node.styles[styleType]];
                    if(styleRef) {
                        if(styleType === 'fill') {
                            vars.fills[styleRef.name] = rgbaColor;
                        }
                        if(styleType === 'text') {
                            if(style) {
                                const textKey = camelCaseToDash(styleRef.name);
                                vars.textStyles[textKey] = formatToCSS(style);
                            }
                        }
                    }
                });
            });
        }
    }

    // If no children then return.
    if(!node.children) {
        return;
    }

    // Travel the tree
    node.children.forEach((childNode: Figma.Node<any>) => {
        return walkFigmaTree(childNode, vars, styles);
    });
}



function createStyleMixins(vars: IOutputStyle, fileNamePath: string, fileFormat: OutputFormat = 'scss') {
    const textVars = Object.keys(vars.textStyles);
    textVars.forEach(textKey => {
        // start mixin
        const mixinName = textKey.replace(/^\$/g, "");
        const value: string = `${getMixinPrefix(fileFormat, mixinName)} {\n`;
        fs.appendFileSync(fileNamePath, value);

        const rules = Object.keys(vars.textStyles[textKey]);
        rules.forEach(cssRule => {
            let cssRuleValue = vars.textStyles[textKey][cssRule];
            if(cssRule === 'font-family') {
                cssRuleValue = `\"${cssRuleValue}\"`;
            }
            const val: string = `\t${cssRule}: ${cssRuleValue};\n`;
            fs.appendFileSync(fileNamePath, val);
        });

        // End mixin
        fs.appendFileSync(fileNamePath, "}\n");
    });
}

function createColorsVariables(vars: IOutputStyle, fileNamePath: string, fileFormat:OutputFormat = 'scss') {
    let varsKeys = Object.keys(vars.fills);
    varsKeys.forEach(varsKey => {
        const variable = formatVariable(varsKey, fileFormat);
        const value: string = `${variable}:${vars.fills[varsKey]};\n`;
        fs.appendFile(fileNamePath, value , (err: any) => {
            if (err) { throw err; }
        });
    });
}