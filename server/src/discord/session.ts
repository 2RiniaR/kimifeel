import { AnyAction, ContextOf, ListenerOf, ParamsOf, ResultOf } from "./action";

export abstract class Session<TAction extends AnyAction> {
  public context: ContextOf<TAction>;
  public listener: ListenerOf<TAction>;
  public result!: ResultOf<TAction>;

  public constructor(context: ContextOf<TAction>, listener: ListenerOf<TAction>) {
    this.context = context;
    this.listener = listener;
  }

  protected abstract fetchParams(): Promise<ParamsOf<TAction> | undefined>;
  protected abstract onSucceed(): Promise<void>;
  protected abstract onFailed(error: unknown): Promise<void>;

  public async run(): Promise<void> {
    const params = await this.fetchParams();
    if (!params) {
      await this.onFailed(Error());
      return;
    }

    try {
      this.result = await this.listener.onAction(params);
    } catch (error) {
      console.error(error);
      await this.onFailed(error);
      return;
    }

    await this.onSucceed();
  }
}
