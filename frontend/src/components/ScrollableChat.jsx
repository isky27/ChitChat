import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
const ScrollableChat = ({messages}) => {

  const { loginDetails } = useSelector((state) => state.auth);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, loginDetails._id) ||
              isLastMessage(messages, i, loginDetails._id)) && (
              <Tooltip label={m.sender.name} placement="botton-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === loginDetails._id ? "#BEE3F8" : "#89F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m,i, loginDetails._id ),
                marginTop: isSameUser(messages, m, i, loginDetails._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat
