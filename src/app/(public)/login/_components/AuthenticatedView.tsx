import { memo } from "react";
import { Button } from "@/app/_components/ui/button";

type Props = {
  email: string;
  onLogout: () => Promise<void>;
};

const AuthenticatedView_: React.FC<Props> = (props) => {
  const { email, onLogout } = props;
  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-[460px]">
        <h1 className="mb-8 text-center text-3xl font-bold">ログイン</h1>
        <div>
          <p className="mt-3 text-sm break-all">
            現在、<span className="font-bold">{email}</span>
            として既にログインしています。
            <br />
            別のアカウントでログインするためには、一度、
            <Button variant="link" className="px-1" onClick={onLogout}>
              ログアウト
            </Button>
            してください。
          </p>
        </div>
      </div>
    </div>
  );
};

const AuthenticatedView = memo(AuthenticatedView_);
AuthenticatedView.displayName = "AuthenticatedView";

export default AuthenticatedView;
