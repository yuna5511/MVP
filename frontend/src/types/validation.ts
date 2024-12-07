export type Validator = (value: string) => string | undefined;
export type AsyncValidator = (value: string) => Promise<string | undefined>;
