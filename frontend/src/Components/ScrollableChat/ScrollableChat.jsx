import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatProvider";
import {
	isLastMessage,
	isSameSender,
	isSameSenderMargin,
	isSameUser,
} from "../../config/ChatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
	const { user } = ChatState();

	return (
		<ScrollableFeed>
			{messages.length > 0
				? messages?.map((m, i) => {
						return (
							<div style={{ display: "flex" }} key={m._id}>
								{(isSameSender(messages, m, i, user._id) ||
									isLastMessage(messages, i, user._id)) && (
									<Tooltip
										label={m.sender.name}
										placement="bottom-start"
										hasArrow
									>
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
										backgroundColor: "white",
										marginLeft: isSameSenderMargin(messages, m, i, user._id),
										marginTop: isSameUser(messages, m, i, user._id) ? 5 : 13,
										borderRadius: "5px",
										padding: "5px 15px",
										maxWidth: "75%",
									}}
								>
									{m.content}
								</span>
							</div>
						);
				  })
				: "Please send a message to start chatting"}
		</ScrollableFeed>
	);
};

export default ScrollableChat;
