import React from 'react'
import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { ChatState } from "./Context/ChatProvider";
import ErrorBoundary from './Context/ErrorBounderies';


const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const { selectedChat } = ChatState();
  return (
    <ErrorBoundary fallback={"ChatBox.js"}>
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDirection="column"
        p={3}
        bg="white"
        w={{ base: "100%", sm: "100%", md: "68%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </ErrorBoundary>
  );
};

export default ChatBox
