import { useState, useRef, useCallback, useMemo } from "react";

interface UseFileDialogReturn {
  isBusy: boolean;
  setIsBusy: (busy: boolean) => void;
  openFileDialog: () => Promise<{ file: File | null; error: string | null }>;
}

/**
 *
 * キャンセル操作にも対応したローディング状態管理が可能なファイル選択ダイアログ
 *
 * デフォルトのファイル選択ダイアログ（<input type="file"/>）のUXに関する課題として...
 *  - ボタン押下後にファイルダイアログが表示されるまでに時間がかかる（2～3秒程度）
 *  - これに対するUX向上のために、onClick イベントでローディングフラグを立てるべきだが
 *  - ファイルが選択されたときは onChange イベントが発火するので、そこでフラグを解除すればよい
 *  - しかし、ダイアログがキャンセルされた場合には onChange イベントが発火せず、フラグ解除ができない
 *
 * このフックは、ダイアログがキャンセルされたときにもローディングフラグをフラグ解除できるようにしたものです
 * （ window.focus イベントを利用してダイアログの終了を検知し、適切にローディング状態を制御 ）
 *
 * 【使用例】
 *  const { isBusy, setIsBusy, openFileDialog } = useFileDialog(mimeToExt, 2);
 *  const file = await openFileDialog(); // ダイアログがオープンして、自動で isBusy が true になる。
 *  // ダイアログがキャンセルされると isBusy は 自動で false に戻る。
 *  if (file) {
 *    await upload(file); // ファイル選択後の後続処理
 *    setIsBusy(false); // 後続処理完了時に手動で isBusy を false にする
 *  }
 *
 **/

export const useFileDialog = (
  mimeToExt: Record<string, string>,
  maxSizeMB: number,
): UseFileDialogReturn => {
  const allowedMimeTypes = useMemo(() => Object.keys(mimeToExt), [mimeToExt]);

  const [isBusy, setIsBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ファイルバリデーション
  const validateFile = useCallback(
    (file: File): string | null => {
      // MIMEタイプチェック
      if (!allowedMimeTypes.includes(file.type)) {
        return `対応していない画像形式です。${Object.values(mimeToExt).join(", ")} のみ使用可能です。`;
      }

      // ファイルサイズチェック
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const actualSizeMB = (file.size / 1024 / 1024).toFixed(2);
        return `画像サイズは${maxSizeMB}MB以下にしてください（現在のサイズ: ${actualSizeMB}MB）`;
      }

      return null;
    },
    [allowedMimeTypes, maxSizeMB, mimeToExt],
  );

  // Promise ベースの「ファイル選択ダイアログ」
  const openFileDialog = useCallback((): Promise<{
    file: File | null;
    error: string | null;
  }> => {
    return new Promise((resolve) => {
      // input要素を作成（初回のみ）
      if (!fileInputRef.current) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = allowedMimeTypes.join(",");
        input.style.display = "none";
        fileInputRef.current = input;
      }

      const input = fileInputRef.current;
      let dialogClosed = false;

      // クリーンアップ関数
      const cleanup = () => {
        input.removeEventListener("change", handleChange);
        window.removeEventListener("focus", handleWindowFocus);
      };

      // ファイル選択時の処理
      const handleChange = () => {
        dialogClosed = true;
        cleanup();

        const file = input.files?.[0];
        input.value = "";

        // ファイル未選択
        if (!file) {
          setIsBusy(false);
          resolve({ file: null, error: null });
          return;
        }

        // ファイルバリデーション
        const validationError = validateFile(file);
        if (validationError) {
          setIsBusy(false);
          resolve({ file: null, error: validationError });
          return;
        }

        // 成功時は isBusy を継続（後続処理のため）
        resolve({ file, error: null });
      };

      // ダイアログキャンセル検知
      const handleWindowFocus = () => {
        setTimeout(() => {
          if (!dialogClosed) {
            dialogClosed = true;
            cleanup();
            setIsBusy(false);
            resolve({ file: null, error: null });
          }
        }, 300);
      };

      // イベントリスナー設定
      input.addEventListener("change", handleChange);
      window.addEventListener("focus", handleWindowFocus, { once: true });

      // ローディング開始とダイアログ表示
      setIsBusy(true);
      try {
        input.click();
      } catch (error) {
        setIsBusy(false);
        cleanup();
        resolve({
          file: null,
          error: "ファイルダイアログを開けませんでした。",
        });
      }
    });
  }, [allowedMimeTypes, validateFile]);

  return {
    isBusy,
    setIsBusy,
    openFileDialog,
  };
};
