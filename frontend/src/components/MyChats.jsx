import React from 'react'
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "./Context/ChatProvider";
import { useSelector } from 'react-redux';
import ErrorBoundary from './Context/ErrorBounderies';

const MyChats = ({fetchAgain}) => {
    
    const { selectedChat, setSelectedChat, chats, setChats }=ChatState();

    const { loginDetails } = useSelector((state) => state.auth);

    const toast = useToast();

    const fetchChats = async () => {
      
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${loginDetails.token}`,
          },
        };

        const { data } = await axios.get(`/chat`, config);
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    useEffect(() => {
      fetchChats();
      // eslint-disable-next-line
    }, [fetchAgain]);
    
  return (
    <ErrorBoundary fallback={"MyChats.js"}>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: selectedChat ? "31%" : "50%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text
            fontSize={{ base: "15px", md: "15px", lg: "20px" }}
            fontWeight={"600"}
          >
            My Chats
          </Text>
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "13px", sm: "13px", md: "15px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loginDetails, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </ErrorBoundary>
  );
}

export default MyChats
