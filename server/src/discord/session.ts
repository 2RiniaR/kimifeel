import { AnyAction, ContextOf, ListenerOf, ParamsOf, ResultOf } from "./action";

export abstract class Session<TAction extends AnyAction> {
  public context: ContextOf<TAction>;
  public listener: ListenerOf<TAction>;
  public result!: ResultOf<TAction>;

  public constructor(context: ContextOf<TAction>, listener: ListenerOf<TAction>) {
    this.context = context;
    this.listener = listener;
  }

  protected abstract fetch(): Promise<ParamsOf<TAction>>;
  protected abstract onSucceed(): Promise<void>;
  protected abstract onFailed(error: unknown): Promise<void>;

  public async run(): Promise<void> {
    try {
      const params = await this.fetch();
      this.result = await this.listener.onAction(params);
    } catch (error) {
      console.error(error);
      await this.onFailed(error);
      return;
    }

    try {
      await this.onSucceed();
    } catch (error) {
      console.error(error);
    }
  }
}
