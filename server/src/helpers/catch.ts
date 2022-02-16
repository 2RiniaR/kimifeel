export type ErrorGuard = (error: unknown) => void;
export type ErrorGuardReturn<T> = (error: unknown) => T;
export type ErrorGuardReturnAsync<T> = (error: unknown) => PromiseLike<T>;

export interface ErrorGuardEnd<T> {
  invoke(run: () => T): T;
}

export interface ErrorGuardEndAsync<T> {
  invokeAsync(run: () => PromiseLike<T>): Promise<T>;
}

export interface ErrorGuardPipeline {
  guard(handler: ErrorGuard): ErrorGuardPipeline;
  guardAndReturn<T>(handler: ErrorGuardReturn<T>): ErrorGuardEnd<T>;
  guardAndReturnAsync<T>(handler: ErrorGuardReturnAsync<T>): ErrorGuardEndAsync<T>;
  invoke<T>(run: () => T): T;
  invokeAsync<T>(run: () => PromiseLike<T>): Promise<T>;
}

class ErrorGuardEndImpl<T> implements ErrorGuardEnd<T> {
  public constructor(private readonly handler: ErrorGuardReturn<T>, private readonly parent?: ErrorGuardPipeline) {}

  public invoke(run: () => T): T {
    try {
      if (this.parent === undefined) return run();
      return this.parent.invoke(run);
    } catch (error) {
      return this.handler(error);
    }
  }
}

class ErrorGuardEndImplAsync<T> implements ErrorGuardEndAsync<T> {
  public constructor(
    private readonly handler: ErrorGuardReturnAsync<T>,
    private readonly parent?: ErrorGuardPipeline
  ) {}

  public async invokeAsync(run: () => PromiseLike<T>): Promise<T> {
    try {
      if (this.parent === undefined) return await run();
      return await this.parent.invokeAsync(run);
    } catch (error) {
      return await this.handler(error);
    }
  }
}

class ErrorGuardPipelineImpl implements ErrorGuardPipeline {
  public constructor(private readonly handler: ErrorGuard, private readonly parent?: ErrorGuardPipeline) {}

  public guard(handler: ErrorGuard): ErrorGuardPipeline {
    return new ErrorGuardPipelineImpl(handler, this);
  }

  public guardAndReturn<T>(handler: ErrorGuardReturn<T>): ErrorGuardEnd<T> {
    return new ErrorGuardEndImpl(handler, this);
  }

  public guardAndReturnAsync<T>(handler: ErrorGuardReturnAsync<T>): ErrorGuardEndAsync<T> {
    return new ErrorGuardEndImplAsync(handler, this);
  }

  public invoke<T>(run: () => T): T {
    try {
      if (this.parent === undefined) return run();
      return this.parent.invoke(run);
    } catch (error) {
      // Errorは親のhandlerから順番にcatchが試行される。
      // handler内でerrorがthrowされた場合、子のhandlerに伝播する。
      this.handler(error);
      throw error;
    }
  }

  public async invokeAsync<T>(run: () => PromiseLike<T>): Promise<T> {
    try {
      if (this.parent === undefined) return await run();
      return await this.parent.invokeAsync(run);
    } catch (error) {
      this.handler(error);
      throw error;
    }
  }
}

export const emptyErrorPipeline: ErrorGuardPipeline = new ErrorGuardPipelineImpl(() => {
  /* do nothing */
});
