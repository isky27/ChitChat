import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../Context/ErrorBounderies";
import { createGroupChat } from "../../redux/chat.slice";
import { resetUsers, searchUser } from "../../redux/user.slice";
import { toast } from "react-toastify";
import ChatLoading from "../ChatLoading";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const { isUserSearchLoading, searchedUser } = useSelector(
    (state) => state.user
  );

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = (query) => {
    if (query) {
      dispatch(searchUser(query));
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill all the feilds");
      return;
    }

    const payload = {
      name: groupChatName,
      users: JSON.stringify(selectedUsers.map((u) => u._id)),
    };

    dispatch(createGroupChat(payload));
    handleCloseModal()
  };

  const handleCloseModal = () => {
    setSelectedUsers([]);
    setGroupChatName("");
    dispatch(resetUsers());
    onClose();
  };

  return (
    <ErrorBoundary fallback={"GroupChatModal.js"}>
      <>
        <span onClick={onOpen}>{children}</span>

        <Modal onClose={handleCloseModal} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {isUserSearchLoading ? (
                <ChatLoading />
              ) : (
                <Box width={"100%"} maxHeight={"50vh"} overflowY="scroll">
                  {searchedUser?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      isSelected={selectedUsers.includes(user)}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))}
                </Box>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </ErrorBoundary>
  );
};

export default GroupChatModal;
