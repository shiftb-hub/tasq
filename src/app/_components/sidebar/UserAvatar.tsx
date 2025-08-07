import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import type { User } from "@prisma/client";
import { useAvatarUrl } from "@/app/_hooks/useAvatarUrl";

interface Props {
  user: User;
}

export const UserAvatar: React.FC<Props> = ({ user }) => {
  const avatarUrl = useAvatarUrl(user.profileImageKey);
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={avatarUrl} alt={user.name} />
      <AvatarFallback className="rounded-lg">
        {user.name?.charAt(0) || "?"}
      </AvatarFallback>
    </Avatar>
  );
};
