import { CommandFormatOn, CommandResultOf, ConvertTypeSetBase, interpretCommand } from "./interpret/interpret";
import { fragmentCommand } from "./fragment";

export function parseCommand<
  TConvertTypeSet extends ConvertTypeSetBase,
  TFormat extends CommandFormatOn<TConvertTypeSet>
>(
  command: string,
  format: TFormat,
  types: TConvertTypeSet,
  prefixes: readonly string[]
): CommandResultOf<TConvertTypeSet, TFormat> | undefined {
  const fragment = fragmentCommand(command, prefixes);
  if (!fragment) return;
  return interpretCommand(fragment, format, types);
}
