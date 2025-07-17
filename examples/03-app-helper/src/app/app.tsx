import {
  Button,
  FullScreenContainer,
  HelperChildProps,
} from "@pipecat-ai/voice-ui-kit";

export const App = ({ handleConnect }: HelperChildProps) => {
  return (
    <FullScreenContainer>
      <Button onClick={() => handleConnect?.()}>Connect</Button>
    </FullScreenContainer>
  );
};
