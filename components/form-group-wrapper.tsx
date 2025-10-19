export const FromGroupWrapper: React.FC<{
  text: React.ReactNode;
  children: React.ReactNode;
}> = ({ text, children }) => {
  return (
    <div className="bg-accent/40 rounded-md p-4 space-y-4 ">
      <h2 className="text-lg font-medium">{text}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};
