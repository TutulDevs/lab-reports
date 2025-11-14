import { cn } from "@/lib/utils";

export type ListItemProps = {
  title?: React.ReactNode;
  hideColon?: boolean;
  children?: React.ReactNode;
  className?: string;
  classNameStrong?: string;
  classNameSpan?: string;
};

export const ListItem: React.FC<ListItemProps> = ({
  title,
  hideColon,
  children,
  className,
  classNameStrong,
  classNameSpan,
}) => {
  return (
    <p className={cn(className)}>
      <strong className={cn(classNameStrong)}>
        {title}
        {hideColon ? "" : ":"}
      </strong>{" "}
      <span className={cn(classNameSpan)}>{children}</span>
    </p>
  );
};
