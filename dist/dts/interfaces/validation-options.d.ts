export interface ValidationOptions {
    name?: String;
    allowExtras?: Boolean;
    autoClean?: Boolean;
    context?: any;
    mutate?: Boolean;
    trimStrings?: Boolean;
    removeEmptyStrings?: Boolean;
    removeEmptyObjects?: Boolean;
    rounding?: 'round' | 'floor' | 'ceil';
    removeExtras?: Boolean;
    castTypes?: Boolean;
    autoValueData?: any;
}
