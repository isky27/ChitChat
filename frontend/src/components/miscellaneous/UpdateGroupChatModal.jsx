import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { searchUser } from "../../redux/user.slice";
import { addNewUserToGroup, removeUserToGroup, renameGroupChat } from "../../redux/chat.slice";

const UpdateGroupChatModal = ({ fetchMessages, setFetchAgain, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isUpdateGroupLoading, isRenameloading, selectedChat } = useSelector(
    (state) => state.chats
  );
  const [groupChatName, setGroupChatName] = useState("");

  const { loginDetails } = useSelector((state) => state.auth);
  const { isUserSearchLoading, searchedUser } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  const handleSearch = async (query) => {
    if (query) {
      dispatch(searchUser(query));
    }
  };

  useEffect(() => {
    setGroupChatName(selectedChat?.chatName);
  }, [selectedChat]);

  const handleRename = async () => {
    if (!groupChatName) return;
    dispatch(
      renameGroupChat({
        chatId: selectedChat._id,
        chatName: groupChatName,
      })
    );
    setFetchAgain(true);
    onClose();
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== loginDetails._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    dispatch(
      addNewUserToGroup({
        chatId: selectedChat._id,
        userId: user1._id,
      })
    );
    setFetchAgain(true);
  };

  const handleRemove = async (user1) => {
    if (
      selectedChat.groupAdmin._id !== loginDetails._id &&
      user1._id !== loginDetails._id
    ) {
      toast.error("Only admins can remove someone!");
      return;
    }

    dispatch(
      removeUserToGroup({
        chatId: selectedChat._id,
        userId: user1._id,
      })
    );
    setFetchAgain(true);
    fetchMessages();
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={isRenameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {isUpdateGroupLoading || isUserSearchLoading ? (
              <Spinner size="lg" />
            ) : (
              <Box maxHeight={"40vh"} w={"100%"} overflowY="scroll">
                {searchedUser?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => handleRemove(loginDetails)}
              colorScheme="red"
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
