import type { FieldError, FieldErrors, FieldValues, Path } from "react-hook-form";

/**
 * react-hook-form 関連のユーティリティ関数
 * FormTextField と FormTextAreaField で共通利用
 */

/**
 * FieldError かどうか判定する型ガード関数
 */
export const isFieldError = (v: unknown): v is FieldError => {
  return Boolean(v) && typeof v === "object" && "type" in (v as Record<string, unknown>);
};

/**
 * "foo.bar[0].baz" のような Path をセグメントに分割
 */
export const splitPath = (name: string): string[] => {
  // bracket を dot に正規化してから split
  return name
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
};

/**
 * errors から該当 name の FieldError を安全に取得
 */
export const getFieldError = <T extends FieldValues>(
  errors: FieldErrors<T>,
  name: Path<T>,
): FieldError | undefined => {
  const segments = splitPath(name);
  let cursor: unknown = errors;

  for (const seg of segments) {
    if (cursor === null || typeof cursor !== "object") return undefined;
    cursor = (cursor as Record<string, unknown>)[seg];
  }
  return isFieldError(cursor) ? cursor : undefined;
};

/**
 * errors から該当 name のエラーメッセージを string として取得
 *
 * react-hook-form の FieldError["message"] 型は string | ReactElement | undefined
 * となるが、このプロジェクトでは string としてしか使わない前提。
 * ReactElement が入るケースは無視し、string | undefined に寄せて扱う。
 */
export const getFieldErrorMessage = <T extends FieldValues>(
  errors: FieldErrors<T>,
  name: Path<T>,
): string | undefined => {
  const err = getFieldError(errors, name);
  return typeof err?.message === "string" ? err.message : undefined;
};
