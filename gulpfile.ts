import * as gulp from "gulp";
import { figma } from "./tasks/figma";
import { convertToSass } from "./tasks/convert-to-sass";


gulp.task("figma", figma);

// gulp figma-to-sass --token=XXXX --fileId== 
// [--colorFormat=hex/rgba]
// [--colorFilename=_color.scss]
gulp.task("figma-to-sass", convertToSass);