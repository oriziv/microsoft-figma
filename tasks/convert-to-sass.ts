import * as Figma from 'figma-api';
import { log, error } from "../utils";
import * as yrags from "yargs";
import * as fs from "fs" ;
const argv: any = yrags.argv;

interface ISassVariable {
    name: string;
    value: string;
}

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
            const styles = file.styles;
            const typography: ISassVariable[] = [];
            const colors: ISassVariable[] = [];
            const styleKeys = Object.keys(styles);
            file.document.children.forEach((child: Figma.Node<'CANVAS'>) => {
                    
                    // Look for nodes with styles
                    child.children.forEach((node: Figma.Node<any>) => {
                        if(node.styles) {
                            if(node.fills && node.fills.length) {
                                // has css properties
                                node.fills.forEach(fill => {
                                    // Check for fill style
                                    if(fill.color) {
                                        const rgbaColor = `rgba(${fill.color.r*255},${fill.color.g*255},${fill.color.b*255},${fill.color.a*255})`;
                                        if(node.styles.fill) {
                                            const styleRef = styles[node.styles.fill];
                                            if(styleRef) {
                                                colors.push({name: styleRef.name, value: rgbaColor});
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
            });

            console.log(colors);
            fs.writeFileSync('1.json', JSON.stringify(file));
        }

    } catch(e) {

    }
}