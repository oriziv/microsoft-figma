import * as gulp from "gulp";
import { figma } from "./tasks/figma";
import { convertToSass } from "./tasks/convert-to-sass";


gulp.task("figma", figma);
gulp.task("figma-to-sass", convertToSass);