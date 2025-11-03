import { cn } from "@/lib/utils";

export const FromGroupWrapper: React.FC<{
  text: React.ReactNode;
  noBg?: boolean;
  children: React.ReactNode;
}> = ({ text, noBg, children }) => {
  return (
    <div
      className={cn({
        ["bg-accent/40 rounded-md p-4 space-y-4"]: !noBg,
        ["space-y-4"]: noBg,
      })}
    >
      {noBg ? null : <h2 className="text-lg font-medium">{text}</h2>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};
