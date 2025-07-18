import { PrismaClient } from "@prisma/client";

// データベース接続用のインスタンスを作成する関数
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// グローバルスコープに prismaGlobal という変数が存在することをTypeScriptに伝える型定義
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 既存の prismaGlobal があればそれを使用し、なければ新しくインスタンスを作成
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// 作成した prisma インスタンスを他から利用できるようにエクスポート
export default prisma;

// 開発環境の場合のみ、作成したインスタンスをグローバルスコープに保存し、
// ホットリロード時の再利用を可能にする
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
