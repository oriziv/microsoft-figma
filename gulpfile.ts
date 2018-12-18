import * as gulp from "gulp";
import { extractFigmaStyles } from "./tasks/extract-figma-styles";


gulp.task("extract-figma-styles", extractFigmaStyles);