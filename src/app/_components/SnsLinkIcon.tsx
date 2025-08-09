import { cn } from "@/app/_libs/utils";

type Props = {
  url: string;
  children: React.ReactNode;
};

const allowedHosts = ["github.com", "instagram.com", "threads.net", "x.com"];

/**
 * 外部サイト専用のリンクコンポーネント
 * <Link> は内部ルーティング用の最適化が目的のため外部URLには不要せず、
 * <a> にすることで、https固定・許可ドメインチェック・IDエスケープなどセキュリティ対策が明示的に実装可能。
 */

export const SnsLinkIcon: React.FC<Props> = ({ url, children }) => {
  try {
    const u = new URL(url);
    // https固定 & 許可ホストのみ
    if (u.protocol !== "https:" || !allowedHosts.includes(u.hostname)) {
      return null; // 不正なら表示しない
    }

    return (
      <a
        href={u.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "rounded-2xl bg-slate-800 p-3",
          "hover:cursor-pointer hover:bg-slate-800/80",
        )}
      >
        {children}
      </a>
    );
  } catch {
    return null;
  }
};
