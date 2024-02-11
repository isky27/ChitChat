import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  IconButton,
  Flex,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useRef, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModel";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import soundMessage from "../assets/message.mp3";
import { Avatar } from "@chakra-ui/avatar";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "./Context/ChatProvider";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "./Context/ErrorBounderies";
import { setSelectedChat } from "../redux/chat.slice";
import {
  getMessage,
  getOldMessage,
  sendMessage,
  setNewMessageReceived,
} from "../redux/message.slice";
import useSound from "use-sound";
const ENDPOINT = "http://localhost:8000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ setFetchAgain }) => {
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [unseenMessages, setUnseenMessages] = useState(0);
  const { loginDetails } = useSelector((state) => state.auth);
  const [notificationSound] = useSound(soundMessage, {
    volume: 0.4,
    playbackRate: 0.5,
    interrupt: true,
  });
  const dispatch = useDispatch();

  const { notification, setNotification } = ChatState();

  const { selectedChat } = useSelector((state) => state.chats);
  const { chatMessage, isLoadingMessage, totalMessage } = useSelector(
    (state) => state.message
  );

  const scrollableDivRef = useRef(null);

  const [isBottom, setIsBottom] = useState(true);

  const scrollToBottom = (behavior) => {
    scrollableDivRef.current.scrollIntoView();
    setUnseenMessages(0)
    setIsBottom(true)
  };

  const handleScroll = (e) => {
    if (Math.abs(e.target.scrollTop)<2) {
      setIsBottom(true);
      setUnseenMessages(0)
    } else {
      setIsBottom(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    dispatch(getMessage({ id: selectedChat._id, page: 1 }));
    setNotification(
      notification.filter((n) => n.chat._id !== selectedChat._id)
    );
    socket.emit("join chat", selectedChat._id);
  };

  const getOlderChat = () => {
    dispatch(getOldMessage({ id: selectedChat._id, page: page + 1 }));
    setPage(page + 1);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      if(!isBottom){
        scrollToBottom();
      }
      socket.emit("stop typing", selectedChat._id);
      setNewMessage("");
      await dispatch(
        sendMessage({
          message: { content: newMessage, chatId: selectedChat._id },
          socket: socket,
        })
      );
      setFetchAgain(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", loginDetails);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("ping", () => socket.emit("pong"));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("disconnect", (reason) => {
      console.error("Disconnected from server:", reason);
      socket.emit("setup", loginDetails);
      socket.on("connected", () => setSocketConnected(true));
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        notificationSound();
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
        }
      } else {
        dispatch(setNewMessageReceived([newMessageRecieved, ...chatMessage]));
         if (!isBottom) {
           setUnseenMessages(unseenMessages + 1);
         }
      }
      setFetchAgain(true);
    });
  });

  console.log(unseenMessages, "unseenMessages");

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <ErrorBoundary fallback={"SingleChat.js"}>
      <>
        {selectedChat ? (
          <>
            <ErrorBoundary fallback={"SingleChat Header"}>
              <Box
                fontSize={{ base: "28px", md: "30px" }}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work sans"
                display="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
              >
                {chatMessage &&
                  (!selectedChat?.isGroupChat ? (
                    <>
                      <Box
                        display="flex"
                        gap="2"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <IconButton
                          display={{ base: "flex", md: "none" }}
                          icon={<ArrowBackIcon />}
                          onClick={() => dispatch(setSelectedChat())}
                        />
                        <ProfileModal
                          user={getSenderFull(
                            loginDetails,
                            selectedChat?.users
                          )}
                        >
                          <Box
                            display="flex"
                            gap="2"
                            alignItems="center"
                            flexWrap="wrap"
                            cursor="pointer"
                          >
                            <Avatar
                              size="sm"
                              cursor="pointer"
                              name={getSender(
                                loginDetails,
                                selectedChat?.users
                              )}
                              src={
                                getSenderFull(loginDetails, selectedChat?.users)
                                  ?.pic
                              }
                            />
                            <Box display="flex" flexDirection="column">
                              <Text
                                fontSize={{
                                  base: "17px",
                                  sm: "17px",
                                  md: "25px",
                                }}
                              >
                                {getSender(loginDetails, selectedChat?.users)}
                              </Text>
                              {istyping ? (
                                <Text
                                  color={"grey"}
                                  fontSize={{
                                    base: "10px",
                                    sm: "10px",
                                    md: "12px",
                                  }}
                                >
                                  Typing...
                                </Text>
                              ) : (
                                <Text>{""}</Text>
                              )}
                            </Box>
                          </Box>
                        </ProfileModal>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box display="flex" gap="2" alignItems="center">
                        <IconButton
                          display={{ base: "flex", md: "none" }}
                          icon={<ArrowBackIcon />}
                          onClick={() => dispatch(setSelectedChat())}
                        />
                        <UpdateGroupChatModal
                          fetchMessages={fetchMessages}
                          setFetchAgain={setFetchAgain}
                        >
                          <Text
                            fontSize={{ base: "17px", sm: "17px", md: "25px" }}
                          >
                            {selectedChat.chatName.toUpperCase()}
                          </Text>
                        </UpdateGroupChatModal>
                      </Box>
                    </>
                  ))}
              </Box>
            </ErrorBoundary>
            <Box
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="90%"
              borderRadius="lg"
              display="flex"
              flexDirection="column"
            >
              <ScrollableChat
                messages={chatMessage}
                isLoadingMessage={isLoadingMessage}
                getOlderChat={getOlderChat}
                totalMessage={totalMessage}
                scrollableDivRef={scrollableDivRef}
                handleScroll={handleScroll}
                unseenMessages={unseenMessages}
                style={{ position: "relative" }}
              />
              {unseenMessages > 0 && (
                <div
                  style={{
                    borderRadius: "50%",
                    fontSize: "12px",
                    width: "max-content",
                    position: "absolute",
                    bottom: "80px",
                    right: "50px",
                    background: "green",
                    color: "white",
                    padding: "6px",
                    zIndex: "30",
                    cursor:"pointer"
                  }}
                  onClick={scrollToBottom}
                >
                  {unseenMessages}
                </div>
              )}
              <FormControl
                onKeyDown={handleKeyPress}
                id="first-name"
                isRequired
                mt={2}
              >
                {" "}
                <Flex border="1px" borderRadius="5px">
                  <InputGroup flex="1">
                    <Input
                      variant="filled"
                      bg="#E0E0E0"
                      placeholder="Enter a message.."
                      value={newMessage}
                      onChange={typingHandler}
                    />
                    <InputRightElement>
                      <IconButton
                        colorScheme="transparent"
                        border="none"
                        color="black"
                        aria-label="Send message"
                        icon={<ArrowRightIcon />}
                        onClick={handleSendMessage}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Flex>
              </FormControl>
            </Box>
          </>
        ) : (
          // to get socket.io on same page
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        )}
      </>
    </ErrorBoundary>
  );
};

export default SingleChat;
