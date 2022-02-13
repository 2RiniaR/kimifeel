import { Communicator } from "../actions";

/**
 * `TArg` から `TCommunicator` を生成し、これを用いて `run` を実行する
 * @param communicator
 * @param action
 */
export function runAction<TArg, TCommunicator extends Communicator>(
  communicator: new (arg: TArg) => TCommunicator,
  action: (com: TCommunicator) => PromiseLike<void>
): (arg: TArg) => PromiseLike<void> {
  return (arg) => action(new communicator(arg));
}
