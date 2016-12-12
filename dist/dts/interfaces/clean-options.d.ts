export interface CleanOptions {
    mutate?: Boolean;
    trimStrings?: Boolean;
    removeEmptyStrings?: Boolean;
    removeEmptyObjects?: Boolean;
    rounding?: 'round' | 'floor' | 'ceil';
    filter?: Boolean;
    autoConvert?: Boolean;
    getAutoValues?: Boolean;
    autoValueData?: any;
}
