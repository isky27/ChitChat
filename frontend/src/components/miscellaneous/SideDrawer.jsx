import React from 'react'
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BiSearch } from "react-icons/bi"
import { BellIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModel";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../Context/ChatProvider";
import { useDispatch, useSelector} from "react-redux"
import { accessChat, setSelectedChat } from '../../redux/chat.slice';
import { toast } from "react-toastify";
import { resetUsers, searchUser } from '../../redux/user.slice';
import { resetAuth } from '../../redux/auth.slice';
import ErrorBoundary from '../Context/ErrorBounderies';
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {
  const [search, setSearch] = useState("");

  const {
    notification,
    setNotification,
  } = ChatState();

  const { loginDetails } = useSelector((state) => state.auth);
  const { isAccessChatLoading } = useSelector((state) => state.chats);
  const { isUserSearchLoading, searchedUser } = useSelector((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const history = useNavigate();
  const dispatch = useDispatch()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    dispatch(resetAuth())
    history("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please Enter something in search");
      return;
    }
    dispatch(searchUser(search));
  };

  const handleAccessChat = (userId) =>{
     dispatch(resetUsers())
     dispatch(accessChat(userId));
     onClose();
  }

  const getGroupdNotification = (list) => {
    const groupedNotifications = {};
    list.forEach((notif) => {
      const sender = getSender(loginDetails, notif.chat.users);

      if (!groupedNotifications[sender]) {
        groupedNotifications[sender] = {
          sender,
          count: 1,
          chat: notif.chat,
        };
      } else {
        groupedNotifications[sender].count += 1;
      }
    });
    return groupedNotifications;
  };

  return (
    <ErrorBoundary fallback={"SideDrawer.js"}>
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 5px 5px 10px"
          borderWidth="5px"
          flexWrap="wrap"
        >
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <BiSearch></BiSearch>
              <Text px={2}>Search User</Text>
            </Button>
          </Tooltip>
          <div>
            <Menu placement="bottom-end">
              <MenuButton p={1}>
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <BellIcon fontSize="2xl" m={1} />
              </MenuButton>
              <MenuList pl={2}>
                {!notification.length && "No New Messages"}
                {Object.values(getGroupdNotification(notification)).map(
                  (groupedNotif) => (
                    <MenuItem
                      key={groupedNotif.sender}
                      onClick={() => {
                        dispatch(setSelectedChat(groupedNotif.chat));
                        setNotification(
                          notification.filter(
                            (n) => n.chat._id !== groupedNotif.chat._id
                          )
                        );
                      }}
                    >
                      {groupedNotif.count > 1
                        ? `${groupedNotif.count} Messages from ${groupedNotif.sender}`
                        : `New Message from ${groupedNotif.sender}`}
                    </MenuItem>
                  )
                )}
              </MenuList>
            </Menu>
            <Menu placement="bottom-end">
              <MenuButton as={Button} bg="white">
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={loginDetails?.name}
                  src={loginDetails?.pic}
                />
              </MenuButton>
              <MenuList>
                <ProfileModal user={loginDetails}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <Box display="flex" alignItems="center" gap="2">
                <IconButton
                  display={{ base: "flex", md: "none" }}
                  icon={<ArrowBackIcon />}
                  onClick={onClose}
                />
                Search Users
              </Box>
            </DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {isUserSearchLoading ? (
                <ChatLoading />
              ) : (
                searchedUser?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAccessChat(user._id)}
                  />
                ))
              )}
              {isAccessChatLoading && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    </ErrorBoundary>
  );
}

export default SideDrawer
