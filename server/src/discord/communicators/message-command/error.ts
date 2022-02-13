import { emptyErrorPipeline } from "helpers/catch";
import * as CommandParser from "command-parser";
import { CommandArgumentUnexpectedError, CommandOptionUnexpectedError, InvalidFormatError } from "../../structures";

export const withConvertParseCommandErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof CommandParser.InvalidFormatError)
    throw new InvalidFormatError(error.parameter.name, error.parameter.convertType.name);
  if (error instanceof CommandParser.UnknownOptionsError) throw new CommandOptionUnexpectedError(error.optionsName);
  if (error instanceof CommandParser.UnexpectedArgumentError)
    throw new CommandArgumentUnexpectedError(error.expected, error.actual);
});
