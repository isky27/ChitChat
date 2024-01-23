import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useSelector } from "react-redux";
import ErrorBoundary from "../components/Context/ErrorBounderies";

const Chats = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { loginDetails } = useSelector((state) => state.auth);

  return (
    <ErrorBoundary fallback={"Chat.js"}>
      <div style={{ width: "100%" }}>
        {loginDetails && <SideDrawer />}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {loginDetails && <MyChats fetchAgain={fetchAgain} />}
          {loginDetails && (<Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
        </Box>
      </div>
    </ErrorBoundary>
  );
}

export default Chats
