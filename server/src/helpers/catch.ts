export type ErrorGuard = (error: unknown) => void;
export type ErrorGuardReturn<T> = (error: unknown) => T;

export interface ErrorGuardEnd<T> {
  invoke(run: () => T): T;
}

export interface ErrorGuardPipeline {
  guard(handler: ErrorGuard): ErrorGuardPipeline;
  guardAndReturn<T>(handler: ErrorGuardReturn<T>): ErrorGuardEnd<T>;
  invoke<T>(run: () => T): T;
}

class ErrorGuardEndImpl<T> implements ErrorGuardEnd<T> {
  public constructor(private readonly handler: ErrorGuardReturn<T>, private readonly parent?: ErrorGuardPipeline) {}

  invoke(run: () => T): T {
    try {
      if (!this.parent) return run();
      return this.parent.invoke(run);
    } catch (error) {
      return this.handler(error);
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

  public invoke<T>(run: () => T): T {
    try {
      if (!this.parent) return run();
      return this.parent.invoke(run);
    } catch (error) {
      // Errorは親のhandlerから順番にcatchが試行される。
      // handler内でerrorがthrowされた場合、子のhandlerに伝播する。
      // この性質を用いて、Errorの発生元から呼び出し元をたどる際に、Errorを順次変換しながら流すことが可能。
      this.handler(error);
      throw error;
    }
  }
}

export const emptyErrorPipeline: ErrorGuardPipeline = new ErrorGuardPipelineImpl(() => {
  /* do nothing */
});
