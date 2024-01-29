import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Box } from "@chakra-ui/layout";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";
import ErrorBoundary from "./Context/ErrorBounderies";
const ScrollableChat = ({ messages }) => {
  const loginDetails = JSON.parse(localStorage.getItem("userInfo")) || "";

  return (
    <ErrorBoundary fallback={"ScrollableChat.js"}>
      <ScrollableFeed>
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
      </ScrollableFeed>
    </ErrorBoundary>
  );
};

export default ScrollableChat;
