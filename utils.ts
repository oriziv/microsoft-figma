import * as gutil from 'gulp-util';

export function log(str: string) {
    return gutil.log(gutil.colors.green(str));
}

export function error(str: string) {
    return gutil.log(gutil.colors.red(str));
}

