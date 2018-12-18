import * as Figma from 'figma-api';

export interface IOutputStyle {
    fills: IFillsOutput;
    textStyles: ITextStyleOutput;
}

export interface IFillsOutput {
    [key: string]: string;
}

export interface ITextStyleOutput {
    [key: string]: {};
}