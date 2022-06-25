import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/SideDrawer/SideDrawer";
import MyChats from "../Components/MyChats/MyChats";
import ChatBox from "../Components/ChatBox/ChatBox";
import { Box } from "@chakra-ui/react";

const Chat = () => {
	const { user } = ChatState();
	const [fetchAgain, setFetchAgain] = useState(false);

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer />}
			<Box
				display="flex"
				justifyContent="space-between"
				w="100%"
				h="91.5vh"
				p="10px"
			>
				{user && (
					<MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
				{user && (
					<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</Box>
		</div>
	);
};

export default Chat;
