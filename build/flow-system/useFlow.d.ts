import { TypedFlow } from "./Flow";
export declare function useFlow<I, O = I, Context = {}>(source: I, builder: (f: TypedFlow<I, I, Context>) => TypedFlow<I, O, Context>, context?: Context): {
    cancel: () => void;
    pause: () => void;
    resume: () => void;
    flow: TypedFlow<I, O, Context> | null;
};
