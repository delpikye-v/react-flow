export type Step<I, O, Context> = (input: I, context: Context, signal: AbortSignal) => O | Promise<O>;
export type Condition<T> = (v: T) => boolean;
export type CancelHandler = () => void;
