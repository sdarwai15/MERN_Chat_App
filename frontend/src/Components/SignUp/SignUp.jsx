import React, { useState } from "react";
import axios from "axios";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmpassword, setConfirmpassword] = useState("");
	const [pic, setPic] = useState("");
	const [picLoading, setPicLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const toast = useToast();
	const navigate = useNavigate();

	const postDetails = (pics) => {
		setLoading(true);
		if (pics === undefined) {
			toast({
				title: "Please Upload a Profile Picture",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		if (pics.type === "image/jpeg" || pics.type === "image/png") {
			const formData = new FormData();
			formData.append("file", pics);
			formData.append("upload_preset", "chat_app");
			formData.append("cloud_name", "dbp26lfxi");
			fetch("https://api.cloudinary.com/v1_1/dbp26lfxi/image/upload", {
				method: "post",
				body: formData,
			})
				.then((res) => res.json())
				.then((data) => {
					setPicLoading(false);
					setPic(data.url);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setPicLoading(false);
					setLoading(false);
					toast({
						title: "Error Uploading Image",
						status: "error",
						duration: 5000,
						isClosable: true,
						position: "bottom",
					});
				});
		} else {
			toast({
				title: "Please Upload a Valid Image",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setPicLoading(false);
			setLoading(false);
		}
	};

	const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
		if (!name || !email || !password || !confirmpassword) {
			toast({
				title: "Please Fill all the Feilds",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
            });
            setLoading(false);
			return;
		}
		if (password !== confirmpassword) {
			toast({
				title: "Passwords do not match",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
            });
            setLoading(false);
			return;
		}
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const { data } = await axios.post(
				"/user/register",
				{ name, email, password, pic },
				config
			);
			toast({
				title: "Signup Successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
			navigate("/chats");
		} catch (error) {
			console.log(error);
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	return (
		<VStack spacing="5px" color="black">
			<FormControl id="name" isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder="Name"
					focusBorderColor="teal.500"
					onChange={(e) => setName(e.target.value)}
				></Input>
			</FormControl>
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					placeholder="Email"
					focusBorderColor="teal.500"
					onChange={(e) => setEmail(e.target.value)}
				></Input>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeholder="Password"
						focusBorderColor="teal.500"
						onChange={(e) => setPassword(e.target.value)}
					></Input>
					<InputRightElement width={"4.5rem"}>
						<Button h="1.75rem" size={"sm"} onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup size="md">
					<Input
						type={show ? "text" : "password"}
						placeholder="Confirm password"
						onChange={(e) => setConfirmpassword(e.target.value)}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="pic">
				<FormLabel>Upload your Picture</FormLabel>
				<Input
					type="file"
					p={1.5}
					accept="image/*"
					focusBorderColor="teal.500"
					onChange={(e) => postDetails(e.target.files[0])}
				/>
			</FormControl>
			<Button
				colorScheme="teal"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={picLoading}
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export default SignUp;
