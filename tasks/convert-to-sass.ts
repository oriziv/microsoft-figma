import * as Figma from 'figma-api';
import { log, error } from "../utils";
import * as yrags from "yargs";
import * as fs from "fs" ;
import { ISassVariables } from './interfaces';
const argv: any = yrags.argv;

export async function convertToSass(): Promise<any> {
    const token = argv.token;
    const fileId = argv.fileId;

    // Input check
    if(!token || !fileId) {
        error('Please provide fileId and personal access token');
        
    }
    // Create API instance
    const api = new Figma.Api({
        personalAccessToken: token,
    });
    
    log('Getting figma file');
    
    try {
        const [ err, file ] = await api.getFile(argv.fileId);
        if (file) {
            const vars: ISassVariables = {};
            const styles = file.styles;
            walkFigmaTree(file.document, vars, styles);

            // Create colors file
            const path: string = "dist/";
            const colorsFilename = argv.colorFilename || '_colors.scss';
            fs.writeFileSync(path + 'file.json', JSON.stringify(file));
            fs.writeFileSync(path + `${colorsFilename}`, "");
            
            // Add colors to file
            const varsKeys = Object.keys(vars);
            varsKeys.forEach(varsKey => {
                if(vars[varsKey].type === 'fill') {
                    const value: string = `${varsKey.replace(/\./g, '-')}:${vars[varsKey].value};\n`;
                    fs.appendFile(path + `${colorsFilename}`, value , (err: any) => {
                        if (err) { throw err; }
                    });
                }
            });
        }

    } catch(e) {
        throw e;
    }
}


function getColorValue(color: Figma.Color, format = 'rgba'): string {
    // Convert color to web rgba format
    color.r*=255;
    color.g*=255;
    color.b*=255;
    const rgba = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    return format === 'hex' ? rgbaToHex(rgba): `rgba(${color.r},${color.g},${color.b},${color.a})`;
}

function trim (str) {
    return str.replace(/^\s+|\s+$/gm,'');
}
  
function rgbaToHex (rgba: string) {
    var parts = rgba.substring(rgba.indexOf("(")).split(","),
        r = parseInt(trim(parts[0].substring(1)), 10),
        g = parseInt(trim(parts[1]), 10),
        b = parseInt(trim(parts[2]), 10),
        a:any = parseFloat(trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);

    return ('#' + r.toString(16) + g.toString(16) + b.toString(16) + (a * 255).toString(16).substring(0,2));
}

// Walk the figma tree recursively and get the styles
function walkFigmaTree(node: Figma.Node<any>, vars: ISassVariables, styles: any) {
    if(!node) {
        return;
    }
    
    // Check node stuff
    if(node.styles) {
        const fills: Figma.Paint[] = node.fills;
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
                        vars[styleRef.name] = { value: rgbaColor, type: styleType };
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