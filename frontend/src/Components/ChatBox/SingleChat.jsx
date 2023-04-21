import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "../ProfileModal/ProfileModal";
import ScrollableChat from "../ScrollableChat/ScrollableChat";
import UpdateGroupChatModal from "../UpdateGroupChatModal/UpdateGroupChatModal";
import "./style.css";
import Lottie from "react-lottie";
import animationData from "../../animations/typing-animation.json";

import io from "socket.io-client";

const ENDPOINT = "https://chit-chat-sula.onrender.com";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const { user, selectedChat, setSelectedChat, notification, setNotification } =
		ChatState();
	const toast = useToast();

	// socket connection to server
	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
	}, []);

	const typeHandler = async (e) => {
		setNewMessage(e.target.value);

		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}

		let lastTypingTime = new Date().getTime();
		setTimeout(() => {
			let now = new Date().getTime();
			if (now - lastTypingTime >= 3000 && typing) {
				setTyping(false);
				socket.emit("stop typing", selectedChat._id);
			}
		}, 3000);
	};

	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			setLoading(true);

			const { data } = await axios.get(`/message/${selectedChat._id}`);

			setMessages(data.messages);
			setLoading(false);

			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Messages",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	const sendMessage = async (event) => {
		if (event.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				setLoading(true);

				const msg = newMessage;

				const config = {
					headers: {
						"Content-Type": "application/json",
					},
				};

				setNewMessage("");

				const { data } = await axios.post(
					"/message",
					{
						content: msg,
						chatId: selectedChat._id,
					},
					config
				);

				socket.emit("new message", data);
				setMessages([...messages, data]);
				setLoading(false);
			} catch (error) {
				console.log(error);
				toast({
					title: "Error sending message",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
			}
		}
	};

	// fetch messages on selectedChat change
	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	// socket for new message
	useEffect(() => {
		socket.on("new message received", (newMessageReceived) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageReceived.chat._id
			) {
				// eligible for notification
				if (!notification.includes(newMessageReceived)) {
					setNotification([newMessageReceived, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessageReceived]);
			}
		});
	}, []);

	// defaultOptions for lottie
	const defaultOptions = {
		loop: false,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						fontFamily={"Work Sans"}
						pb={3}
						px={2}
						w="100%"
						display={"flex"}
						justifyContent={"space-between"}
						alignItems={"center"}
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModal user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal
									fetchMessages={fetchMessages}
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
								/>
							</>
						)}
					</Text>
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="flex-end"
						p={3}
						bg="linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						{loading ? (
							<Spinner
								size={"xl"}
								w={20}
								h={20}
								alignSelf={"center"}
								margin={"auto"}
							/>
						) : (
							<div className="messages">
								<ScrollableChat messages={messages} />
							</div>
						)}

						<FormControl onKeyDown={sendMessage} mt={3} isRequired>
							{isTyping ? (
								<div>
									<Lottie
										options={defaultOptions}
										width={70}
										style={{ marginBottom: 15, marginLeft: 0 }}
									/>
								</div>
							) : null}
							<Input
								variant={"filled"}
								bg="white"
								placeholder="Type a message..."
								value={newMessage}
								onChange={typeHandler}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display={"flex"}
					alignItems={"center"}
					justifyContent={"center"}
					h="100%"
				>
					<Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
						Select a chat to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
