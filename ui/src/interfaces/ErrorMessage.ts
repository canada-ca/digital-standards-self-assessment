export interface ErrorMessage {
  message: string;
  param?: any;
}

export interface GlobalError {
  message: ErrorMessage;
}

export interface FieldError extends GlobalError {
  fieldName: string;
}

export interface Errors {
  globalErrors?: Array<GlobalError>;
  fieldErrors?: Array<FieldError>;
}
