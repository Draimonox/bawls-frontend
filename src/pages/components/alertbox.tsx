import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

function Demo() {
  const icon = <IconInfoCircle />;
  return (
    <Alert
      variant="light"
      color="blue"
      radius="xl"
      withCloseButton
      title="Alert title"
      icon={icon}
    >
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis,
      quae tempore necessitatibus placeat saepe.
    </Alert>
  );
}
