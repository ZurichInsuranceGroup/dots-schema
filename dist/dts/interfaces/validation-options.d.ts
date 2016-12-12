import { CleanOptions } from './clean-options';
export interface ValidationOptions {
    name?: String;
    strict?: Boolean;
    clean?: CleanOptions;
    context?: any;
}
