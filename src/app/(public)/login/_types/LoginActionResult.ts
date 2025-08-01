export type LoginActionResult =
  | {
      success: true;
      redirectTo: string;
    }
  | {
      success: false;
      errorMessageForUser: string;
    };
