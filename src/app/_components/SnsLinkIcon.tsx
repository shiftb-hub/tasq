import { cn } from "@/app/_libs/utils";

type Props = {
  url: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

const allowedHosts = ["github.com", "instagram.com", "threads.net", "x.com"];

/**
 * 外部サイト専用のリンクコンポーネント
 * <Link> は内部ルーティング用の最適化が目的のため外部URLには不要せず、
 * <a> にすることで、https固定・許可ドメインチェック・IDエスケープなどセキュリティ対策が明示的に実装可能。
 */

export const SnsLinkIcon: React.FC<Props> = ({ url, children, ariaLabel }) => {
  try {
    const u = new URL(url);

    // "www." が付いていても同一ドメインとして扱うため hostname を正規化
    // 例: www.instagram.com → instagram.com
    const hostname = u.hostname.toLowerCase().replace(/^www\./, "");

    // https 固定 & 許可ドメインのみ（サブドメイン偽装: foo.instagram.com.evil.com は除外される）
    if (u.protocol !== "https:" || !allowedHosts.includes(hostname)) {
      return null; // 許可ホスト以外なら表示しない
    }

    return (
      <a
        href={u.toString()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
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
