import React, { useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading/ChatLoading";
import UserListItem from "../UserListItem/UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const {
		setSelectedChat,
		user,
		notification,
		setNotification,
		chats,
		setChats,
	} = ChatState();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const logoutHandler = () => {
		localStorage.removeItem("userInfo");
		navigate("/");
	};

	const handleSearch = async (e) => {
		if (!search) {
			toast({
				title: "Please enter a search term",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}

		try {
			setLoading(true);

			const { data } = await axios.get(`/user?search=${search}`);

			await setSearchResult(data.users);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error searching for user",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);

			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.post(
				"/chat",
				{
					userId,
				},
				config
			);

			if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

			setLoadingChat(false);
			setSelectedChat(data);
			onClose();
		} catch (error) {
			toast({
				title: "Error accessing chat",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px 5px 10px"
				borderWidth="3px"
			>
				<Tooltip label="Search users to chat" hasArrow placement="bottom-end">
					<Button variant="ghost" onClick={onOpen}>
						<i className="fas fa-search"></i>
						<Text d={{ base: "none", md: "flex" }} px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize="2xl" fontFamily="Work sans">
					ChitChat
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<NotificationBadge
								count={notification.length}
								effect={Effect.SCALE}
							/>
							<BellIcon fontSize={"2xl"} m={1} />
						</MenuButton>
						<MenuList pl={3}>
							{notification.length > 0
								? notification.map((n) => {
										return (
											<MenuItem
												key={n._id}
												onClick={() => {
													setSelectedChat(n.chat);
													setNotification(
														notification.filter((noti) => noti !== n)
													);
												}}
											>
												{n.chat.isGroupChat ? (
													<>
														<strong>{n.chat.chatName}</strong>
														<small style={{ marginLeft: "5px" }}>
															{" "}
															New Message
														</small>
													</>
												) : (
													<>
														<strong>{getSender(user, n.chat.users)}</strong>
														<small style={{ marginLeft: "5px" }}>
															{" "}
															New Message
														</small>
													</>
												)}
												<Text>{n.message}</Text>
											</MenuItem>
										);
								  })
								: "No new messages"}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size={"sm"}
								cursor="pointer"
								name={user.name}
								src={user.pic}
							></Avatar>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
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
					<DrawerHeader borderBottomWidth={1}>Search Users</DrawerHeader>
					<DrawerBody>
						<Box display={"flex"} pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={handleSearch}>Go</Button>
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResults?.map((user) => (
								<UserListItem
									key={user._id}
									dets={user}
									handleFunction={() => accessChat(user._id)}
								/>
							))
						)}
						{loadingChat && <Spinner display={"flex"} ml="auto" />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
