"use client";

import { Button } from "@/app/_components/ui/button";
import { logoutAction } from "@/app/_actions/logoutAction";

type Props = {
  action: string;
  email: string;
};

export const AlreadyLoggedInPage: React.FC<Props> = (props) => {
  const { action, email } = props;
  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-[460px]">
        <h1 className="mb-8 text-center text-3xl font-bold">{action}</h1>
        <div>
          <p className="mt-3 text-sm break-all">
            現在、<span className="mr-1 font-bold">{email}</span>
            として既にログインしています。
            <br />
            別のアカウントで{action}するためには、一旦、
            <Button
              variant="link"
              className="px-0.5 text-blue-500"
              onClick={async () => await logoutAction()}
            >
              ログアウト
            </Button>
            してください。
          </p>
        </div>
      </div>
    </div>
  );
};
