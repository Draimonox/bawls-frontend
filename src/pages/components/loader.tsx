import {
  Flex,
  Loader as ExternalLoader,
  MantineLoadersRecord,
} from "@mantine/core";
import { useState } from "react";

const Loader = ({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) => {
  //   const [showLoader, setShowLoader] = useState(isLoading);
  console.log(isLoading);
  return (
    <Flex
      mih={50}
      gap="md"
      justify="center"
      align="center"
      direction="row"
      wrap="wrap"
      style={{ textAlign: "center" }}
    >
      {isLoading ? "Loading..." : children}
    </Flex>
  );
};

export default Loader;
