declare module 'jsonwebtoken' {
  function sign(payload: string | Buffer | object, secretOrPrivateKey: string, options?: jwt.SignOptions): string;
  function verify(
    token: string,
    secretOrPublicKey: string,
    options?: jwt.VerifyOptions,
  ): string | jwt.JwtPayload;

  namespace jwt {
    interface SignOptions {
      expiresIn?: string | number;
    }

    interface VerifyOptions {
      ignoreExpiration?: boolean;
    }

    interface JwtPayload {
      [key: string]: unknown;
      sub?: string;
    }
  }

  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
  };

  export = jwt;
}
