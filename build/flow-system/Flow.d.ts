export type Step<I, O, Context> = (input: I, context: Context, signal: AbortSignal) => O | Promise<O>;
export type Condition<T> = (v: T) => boolean;
export type CancelHandler = () => void;
export type TypedFlow<I, O, Context> = Flow<Context> & {
    run(input?: I): Promise<O | undefined>;
    step<N>(fn: Step<O, N, Context>): TypedFlow<I, N, Context>;
    tap(fn: (v: O, context: Context) => void): TypedFlow<I, O, Context>;
    filter(cond: Condition<O>): TypedFlow<I, O, Context>;
    debounce(ms: number): TypedFlow<I, O, Context>;
    throttle(ms: number): TypedFlow<I, O, Context>;
    leading(ms: number): TypedFlow<I, O, Context>;
    map<N>(fn: (v: O, context: Context) => N): TypedFlow<I, N, Context>;
    switchMap<N>(fn: Step<O, N, Context>): TypedFlow<I, N, Context>;
    exhaustMap<N>(fn: Step<O, N, Context>): TypedFlow<I, N, Context>;
    distinct(compare?: (prev: O, next: O) => boolean): TypedFlow<I, O, Context>;
    retry(times: number | {
        times: number;
        delay?: number;
        backoff?: "linear" | "exponential";
    }): TypedFlow<I, O, Context>;
    poll(ms: number, options?: {
        until?: (v: O) => boolean;
        max?: number;
    }): TypedFlow<I, O, Context>;
    timeout(ms: number): TypedFlow<I, O, Context>;
    catch(fn: (e: any, context: Context) => O | Promise<O>): TypedFlow<I, O, Context>;
    take(n: number): TypedFlow<I, O, Context>;
    finally(fn: () => void): TypedFlow<I, O, Context>;
};
export declare class Flow<Context = {}> {
    private readonly ctx;
    static SKIP: symbol;
    private ops;
    private paused?;
    private resume;
    private controller;
    private cancelHandlers;
    private onStartHandlers;
    private onDoneHandlers;
    private onErrorHandlers;
    private finallyHandlers;
    private initialInput?;
    constructor(ctx?: Context);
    static from<I, Context = {}>(input: I, context?: Context): TypedFlow<I, I, Context>;
    run(input?: unknown): Promise<any>;
    onStart(fn: () => void): this;
    onDone(fn: () => void): this;
    onError(fn: (e: any) => void): this;
    onCancel(fn: CancelHandler): this;
    cancel(): void;
    pause(): this;
    resumeFlow(): this;
    private waitIfPaused;
    context(): Context;
    step(fn: Step<any, any, Context>): any;
    tap(fn: (v: any, context: Context) => void): any;
    filter(cond: Condition<any>): any;
    debounce(ms: number): any;
    leading(ms: number): any;
    throttle(ms: number): any;
    take(n: number): any;
    map(fn: (v: any, context: Context) => any): any;
    switchMap(fn: Step<any, any, Context>): any;
    exhaustMap(fn: Step<any, any, Context>): any;
    distinct(compare?: (prev: any, next: any) => boolean): any;
    retry(timesOrOptions: number | {
        times: number;
        delay?: number;
        backoff?: "linear" | "exponential";
    }): this;
    poll(ms: number, options?: {
        until?: (v: any) => boolean;
        max?: number;
    }): this;
    timeout(ms: number): this;
    catch(fn: (e: any, context: Context) => any): this;
    finally(fn: () => void): this;
}
