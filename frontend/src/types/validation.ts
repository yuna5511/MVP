export type Validator = (value: string) => string | undefined;
export type ExistsValidator = (
  value: string,
  fieldName: string,
  min?: number
) => string | undefined;
export type AsyncValidator = (value: string) => Promise<string | undefined>;
