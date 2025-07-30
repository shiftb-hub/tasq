import NextLink from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

type Props = {
  platformName: string;
  url: string;
  className?: string;
};

/**
 * ソーシャルアカウント確認用リンクコンポーネント
 * 入力されたアカウント情報の確認のために外部プラットフォームへのリンクを表示
 */
export const SocialAccountVerifyLink: React.FC<Props> = (props) => {
  const { platformName, url, className } = props;
  return (
    <div className={twMerge("ml-1 text-right text-xs", className)}>
      <NextLink
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-1 text-blue-500"
      >
        {platformName}で確認する
        <FiExternalLink className="ml-0.5 inline-block" />
      </NextLink>
    </div>
  );
};
