/**
 * お困りタスク動向の情報を取得する関数
 * @param trend - 変化量
 */
const getTrendInfo = (trend: number) => {
  if (trend > 0) return { text: `${trend}個増加`, color: "text-red-600" };
  if (trend < 0) return { text: `${Math.abs(trend)}個減少`, color: "text-green-600" };
  return { text: "変化なし", color: "text-gray-500" };
};

interface Props {
  /** 変化量（正数=増加、負数=減少、0=変化なし） */
  trend: number;
}

/**
 * お困りタスク動向表示コンポーネント
 * @description タスクの変化量を視覚的に表示
 */
export const TaskTrend: React.FC<Props> = ({ trend }) => {
  const { text, color } = getTrendInfo(trend);

  return (
    <span className={`text-sm font-medium ${color}`} aria-label={`お困りタスク数の変化: ${text}`}>
      {text}
    </span>
  );
};
