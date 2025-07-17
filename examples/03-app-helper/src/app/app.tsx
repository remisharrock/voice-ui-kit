import {
  Button,
  FullScreenContainer,
  HelperChildrenProps,
} from "@pipecat-ai/voice-ui-kit";

export const App = ({ handleConnect }: HelperChildrenProps) => {
  return (
    <FullScreenContainer>
      <Button onClick={() => handleConnect?.()}>Connect</Button>
    </FullScreenContainer>
  );
};
