import React from "react";
import { Spinner } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { Avatar } from "@chakra-ui/react";
import ErrorBoundary from "./Context/ErrorBounderies";
import InfiniteScroll from "react-infinite-scroll-component";

const ScrollableChat = ({
  messages,
  isLoadingMessage,
  getOlderChat,
  totalMessage,
  scrollableDivRef,
  handleScroll,
  unseenMessages,
}) => {
  const loginDetails = JSON.parse(localStorage.getItem("userInfo")) || "";

  return (
    <ErrorBoundary fallback={"ScrollableChat.js"}>
      <div
        id="scrollableDiv"
        onScroll={handleScroll}
        style={{
          overflowY: "auto",
          display: "flex",
          height: "90%",
          position: "relative",
          flexDirection: "column-reverse",
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={() => {
            getOlderChat();
            console.log("loading more");
          }}
          hasMore={messages.length < totalMessage}
          inverse={true}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          scrollableTarget="scrollableDiv"
        >
          <div ref={scrollableDivRef} />
          {messages &&
            messages?.map((m, i) => (
              <ErrorBoundary fallback={"innerbox ScrollableChat.js"}>
                <Box display="flex" key={m._id}>
                  {(isSameSender(messages, m, i, loginDetails?._id) ||
                    isLastMessage(messages, i, loginDetails?._id)) && (
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m?.sender?.name}
                      src={m?.sender?.pic}
                    />
                  )}
                  <ErrorBoundary fallback={"Span in Scrollable.js"}>
                    <span
                      style={{
                        backgroundColor: `${
                          m.sender?._id === loginDetails?._id
                            ? "#BEE3F8"
                            : "#89F5D0"
                        }`,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          loginDetails?._id
                        ),
                        marginTop: isSameUser(messages, m, i, loginDetails?._id)
                          ? 3
                          : 10,
                      }}
                    >
                      {m.content}
                    </span>
                  </ErrorBoundary>
                </Box>
              </ErrorBoundary>
            ))}
          {isLoadingMessage && (
            <Spinner size="xl" w={5} h={5} alignSelf="center" margin="auto" />
          )}
        </InfiniteScroll>
      </div>
    </ErrorBoundary>
  );
};

export default ScrollableChat;
