import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const MeIndicator: React.FC<{ isMe?: boolean }> = ({ isMe }) => {
  if (!isMe) return null;

  return (
    <Tooltip>
      <TooltipTrigger className="w-2 h-2 bg-success rounded-full "></TooltipTrigger>
      <TooltipContent>
        <p>Me</p>
      </TooltipContent>
    </Tooltip>
  );
};
