import { ViewIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	FormControl,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserBadgeItem/UserBadgeItem";
import UserListItem from "../UserListItem/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
	const [groupChatName, setGroupChatName] = useState();
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameloading, setRenameLoading] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user, selectedChat, setSelectedChat } = ChatState();
	const toast = useToast();

	const handleRename = async () => {
		if (!groupChatName) {
			toast({
				title: "Please enter a group name",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			setRenameLoading(true);

			const { data } = await axios.patch("/chat/rename", {
				chatId: selectedChat.id,
				chatName: groupChatName,
			});

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch (error) {
			toast({
				title: "Error renaming group",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			setRenameLoading(false);
		}
	};

	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}

		try {
			setLoading(true);
			const { data } = await axios.get(`/user?search=${search}`);
			setLoading(false);
			await setSearchResult(data.users);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Search Results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	const handleAddUser = async (userToAdd) => {
		if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
			toast({
				title: "User Already in group!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: "Only admins can add someone!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);

			const { data } = await axios.patch("/chat/groupadd", {
				chatId: selectedChat._id,
				userId: userToAdd._id,
			});

			await setSelectedChat(data);
			await setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	const handleRemove = async (userToRemove) => {
		if (
			selectedChat.groupAdmin._id !== user._id &&
			userToRemove._id !== user._id
		) {
			toast({
				title: "Only admins can remove someone!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);

			const { data } = await axios.patch("/chat/groupremove", {
				chatId: selectedChat._id,
				userId: userToRemove._id,
			});

			userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
			await setFetchAgain(!fetchAgain);
			fetchMessages();
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error removing user",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	return (
		<>
			<IconButton
				onClick={onOpen}
				display={{ base: "flex" }}
				icon={<ViewIcon />}
			/>

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
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

					<ModalBody
						display={"flex"}
						flexDirection={"column"}
						alignItems={"center"}
					>
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

						<FormControl d="flex">
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
								isLoading={renameloading}
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

						{loading ? (
							<Spinner size="lg" />
						) : (
							searchResult?.map((user) => (
								<UserListItem
									key={user._id}
									dets={user}
									handleFunction={() => handleAddUser(user)}
								/>
							))
						)}
					</ModalBody>
					<ModalFooter>
						<Button onClick={() => handleRemove(user)} colorScheme="red">
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;
