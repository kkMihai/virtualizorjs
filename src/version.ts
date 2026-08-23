declare const __PACKAGE_VERSION__: string;

export const UNKNOWN_VERSION = '0.0.0';

export const PACKAGE_VERSION: string =
  typeof __PACKAGE_VERSION__ === 'string' ? __PACKAGE_VERSION__ : UNKNOWN_VERSION;
