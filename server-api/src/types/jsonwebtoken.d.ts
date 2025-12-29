declare module 'jsonwebtoken' {
  export interface SignOptions {
    expiresIn?: string | number;
    algorithm?: string;
  }
  
  export function sign(payload: object, secret: string, options?: SignOptions): string;
  export function verify(token: string, secret: string): any;
  export function decode(token: string): any;
}
