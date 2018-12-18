import * as gutil from 'gulp-util';
import * as Figma from 'figma-api';

export function log(str: string) {
    return gutil.log(gutil.colors.green(str));
}

export function error(str: string) {
    return gutil.log(gutil.colors.red(str));
}

export function getColorValue(color: Figma.Color, format = 'rgba'): string {
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

export function formatToCSS(style: Figma.TypeStyle) {
    const keys = Object.keys(style);
    const mapRule = {
        'fontFamily': 'font-family', 
        'fontWeight': 'font-weight',
        'fontSize': 'font-size',
        'lineHeightPx': 'line-height'
    };

    const rules = {};
    keys.forEach(key => {
        if(mapRule[key]) {
            let value = style[key];
            if(key === 'fontSize' || key === 'lineHeightPx') {
                value = `${Math.round(value)}px`;
            }
            rules[mapRule[key]] = value;
        }
    });

    return rules;
}

export function camelCaseToDash( myStr ) {
    return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}