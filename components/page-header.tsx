import React from "react";

export const PageHeaderSection: React.FC<{
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ title, subtitle, children }) => {
  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between">
        <div>
          <h1 className="text-lg md:text-3xl mb-2">{title}</h1>

          {subtitle && <p>{subtitle}</p>}
        </div>

        {children}
      </div>

      <hr className="my-4" />
    </>
  );
};
