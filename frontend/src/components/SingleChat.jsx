import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModel";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../Animation/typing.json";
import soundMessage from "../assets/message.mp3"
import { Avatar } from "@chakra-ui/avatar";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "./Context/ChatProvider";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "./Context/ErrorBounderies";
import { setSelectedChat } from "../redux/chat.slice";
import { getMessage, sendMessage, setNewMessageReceived } from "../redux/message.slice";
import useSound from "use-sound";
const ENDPOINT = "http://localhost:8000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ setFetchAgain }) => {
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const { loginDetails } = useSelector((state) => state.auth);
  const [notificationSound] = useSound(soundMessage, {
    volume: 0.1,
    playbackRate: 0.5,
    interrupt:true,
  });
  const dispatch = useDispatch()

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
  const { notification, setNotification } = ChatState();

  const { selectedChat } = useSelector((state) => state.chats);
  const { chatMessage, isLoadingMessage } = useSelector((state) => state.message);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    dispatch(getMessage(selectedChat._id));
    setNotification(
      notification.filter((n) => n.chat._id !== selectedChat._id)
    );
    socket.emit("join chat", selectedChat._id);
  };

  const handleSendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setNewMessage("");
      await dispatch(
        sendMessage({
          message:{content: newMessage,
          chatId: selectedChat._id},
          socket:socket
        })
      );
      setFetchAgain(true);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", loginDetails);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
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
        dispatch(setNewMessageReceived([...chatMessage,newMessageRecieved]));
      }
      setFetchAgain(true);
    });
  });

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
                      <ProfileModal user={getSenderFull(loginDetails, selectedChat?.users)}>
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
                            name={getSender(loginDetails, selectedChat?.users)}
                            src={
                              getSenderFull(loginDetails, selectedChat?.users)
                                ?.pic
                            }
                          />
                          <Text fontSize={{ base: "17px", sm: "17px", md: "25px" }}>
                            {getSender(loginDetails, selectedChat?.users)}
                          </Text>
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
                    <UpdateGroupChatModal fetchMessages={fetchMessages} setFetchAgain={setFetchAgain}>
                      <Text fontSize={{ base: "17px", sm: "17px", md: "25px" }}>
                        {selectedChat.chatName.toUpperCase()}
                      </Text>
                    </UpdateGroupChatModal>
                    </Box>
                  </>
                ))}
            </Box>
           </ErrorBoundary>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {isLoadingMessage ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div className="messages">
                  <ScrollableChat messages={chatMessage} />
                </div>
              )}
              <FormControl
                onKeyDown={handleSendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
                {istyping && (
                  <div
                    style={{
                      marginBottom: "10px",
                      marginLeft: "5px",
                      display: "flex",
                    }}
                  >
                    <Lottie
                      options={defaultOptions}
                      height={30}
                      width={50}
                      justifyContent="flex-start"
                    />
                  </div>
                )}
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
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
