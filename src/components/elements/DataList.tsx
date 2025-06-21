import React, { type ReactNode } from "react";

interface DataListProps {
  data: Record<string, string | ReactNode>;
  className?: string;
}

const DataList: React.FC<DataListProps> = ({ data, className = "" }) => {
  return (
    <dl
      className={`text-sm grid grid-cols-[1fr_2fr] gap-2 items-center ${className}`}
    >
      {Object.entries(data).map(([key, value]) => (
        <React.Fragment key={key}>
          <dt className="text-muted-foreground">{key}</dt>
          <dd className="text-right font-mono text-xs min-w-0 truncate">
            {value}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

export default DataList;
