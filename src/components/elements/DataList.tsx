import React, { type ReactNode } from "react";

interface DataListProps {
  data: Record<string, string | ReactNode>;
  className?: string;
}

export const DataList: React.FC<DataListProps> = ({ data, className = "" }) => {
  return (
    <dl
      className={`vkui:text-sm vkui:grid vkui:grid-cols-[1fr_2fr] vkui:gap-2 vkui:items-center ${className}`}
    >
      {Object.entries(data).map(([key, value]) => (
        <React.Fragment key={key}>
          <dt className="vkui:text-muted-foreground">{key}</dt>
          <dd className="vkui:text-right vkui:font-mono vkui:text-xs vkui:min-w-0 vkui:truncate">
            {value}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

export default DataList;
