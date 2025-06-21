import { lazy, Suspense } from "react";
import type { ConsoleTemplateProps } from "./ConsoleTemplate";

const ConsoleTemplate = lazy(() =>
  import("./ConsoleTemplate").then((module) => ({
    default: module.ConsoleTemplate,
  })),
);

const ConsoleTemplateLazy = (props: ConsoleTemplateProps) => {
  return (
    <Suspense fallback={null}>
      <ConsoleTemplate {...props} />
    </Suspense>
  );
};

export { ConsoleTemplateLazy as ConsoleTemplate };
