/**
 * Common type definitions for the custom report generator
 */

// ===== Chart Types =====

export interface ChartDataSeries {
    name: string;
    labels: string[];
    values: number[];
}

export interface ChartDataConfig {
    sourceUrl: string;
    chartTitle: string;
    chartData: ChartDataSeries[];
}

export interface ChartDataCollection {
    [key: string]: ChartDataConfig;
}

// ===== Slide Types =====

export type SlideType =
    | 'title'
    | 'oneContent'
    | 'twoContents'
    | 'oneTwoContents'
    | 'twoOneContents'
    | 'threeContents'
    | 'threeOneContents'
    | 'verticalFourContents'
    | 'custom';

export type VisualizationType =
    | 'bar'
    | 'line'
    | 'area'
    | 'pie'
    | 'table'
    | 'wordcloud'
    | 'stackedBar'
    | 'horizontalBar';

export type ResponseType =
    | 'chart'
    | 'table'
    | 'text'
    | 'image'
    | 'sample';

// ===== Position & Size Types =====

export interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface SlidePosition {
    [key: string]: Position;
}

// ===== Report Configuration Types =====

export interface ReportConfig {
    title?: string;
    slides?: SlideConfig[];
    theme?: ThemeConfig;
}

export interface SlideConfig {
    slideType: SlideType;
    title?: string;
    subtitle?: string;
    contents?: ContentConfig[];
}

export interface ContentConfig {
    responseType?: ResponseType;
    visualization?: VisualizationType;
    metric?: string;
    data?: any;
    title?: string;
}

export interface ThemeConfig {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
}

// ===== Express Request/Response Types =====

export interface GeneratePptRequest {
    config?: ReportConfig;
    data?: any;
    filename?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// ===== Database Model Types =====

export interface ModelAttributes {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
