import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

function alertBox(title: string, body: string) {
  const icon = <IconInfoCircle />;
  return (
    <Alert
      variant="light"
      color="blue"
      radius="xl"
      withCloseButton
      title={title}
      icon={icon}
    >
      {body}
    </Alert>
  );
}

export default alertBox;
