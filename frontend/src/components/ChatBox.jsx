import React from 'react'
import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import ErrorBoundary from './Context/ErrorBounderies';
import { useSelector } from 'react-redux';


const ChatBox = ({setFetchAgain}) => {
  const { selectedChat } = useSelector((state) => state.chats);
  return (
    <ErrorBoundary fallback={"ChatBox.js"}>
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDirection="column"
        p={3}
        bg="white"
        w={{ base: "100%", sm: "100%", md: "55%", lg:"60%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <SingleChat setFetchAgain={setFetchAgain} />
      </Box>
    </ErrorBoundary>
  );
};

export default ChatBox
