import { useLocalVAD } from "@/hooks/useLocalVAD";

export const LocalVADPanel = () => {
  const vadInstance = useLocalVAD();

  console.log(vadInstance);

  return <div>LocalVADPanel</div>;
};
