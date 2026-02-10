import { TypedFlow } from "./Flow";
export declare const sleep: (ms: number, signal: AbortSignal) => Promise<void>;
export declare function createFlow<I, O = I, Context = {}>(context?: Context): TypedFlow<I, O, Context>;
