import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Chatbox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useSelector } from "react-redux";
import ErrorBoundary from "../components/Context/ErrorBounderies";

const Chats = () => {
  const [fetchAgain, setFetchAgain] = useState(true);
  const { loginDetails } = useSelector((state) => state.auth);

   const { myChats, isChatLoading } = useSelector((state) => state.chats);

   useEffect(() => {
     if (!isChatLoading && myChats) {
       setFetchAgain(false);
     }
   }, [myChats, isChatLoading]);

  return (
    <ErrorBoundary fallback={"Chat.js"}>
      <div style={{ width: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="99vh"
          p="10px"
        >
          {loginDetails && (<MyChats fetchAgain={fetchAgain} />)}
          {loginDetails && (<Chatbox setFetchAgain={setFetchAgain} />)}
        </Box>
      </div>
    </ErrorBoundary>
  );
}

export default Chats
