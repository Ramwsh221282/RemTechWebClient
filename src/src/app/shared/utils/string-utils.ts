﻿export class StringUtils {
  public static isEmptyOrWhiteSpace(value: string): boolean {
    return value.trim().length === 0;
  }
}
