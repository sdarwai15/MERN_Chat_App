import {
	Box,
	Container,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Login/Login";
import SignUp from "../Components/SignUp/SignUp";

const Home = () => {

	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("userInfo"));

		if (user) navigate("/chats");
	}, [navigate]);

	return (
		<Container
			maxW="xl"
			position="absolute"
			top="50%"
			left="50%"
			transform="translate(-50%, -50%)"
		>
			<Box
				display="flex"
				justifyContent="center"
				p="2"
				bg="white"
				w="100%"
				m="10px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
			>
				<Text fontSize="3xl" fontFamily="Work Sans" color="black">
					ChitChat
				</Text>
			</Box>
			<Box
				bg="white"
				w="100%"
				p={3}
				borderRadius="lg"
				borderWidth="1px"
				color="black"
			>
				<Tabs variant="soft-rounded" colorScheme="teal">
					<TabList mb="1em">
						<Tab width="50%">Login</Tab>
						<Tab width="50%">Sign Up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<SignUp />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default Home;
