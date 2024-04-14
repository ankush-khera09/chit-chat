import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();

    const [show, setShow] = useState(false);     // show-hide password
    const handleShow = () => setShow(!show);

    const [loading, setLoading] = useState(false);    // kind of boolean flag variable
    const toast = useToast();    // pop-up in chakra ui

    const navigate = useNavigate();

    // validating and uploading pic to cloudinary
    const postDetails = (pic) => {
        setLoading(true);
        if(pic===undefined){
            // toast is a pop-up in chakra ui
            toast(
                {   
                    title: "Please select an image!",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                }
            );
            return;
        }

        if(pic.type === "image/jpeg" || pic.type === "image/png"){
            // we are using 'cloudinary' website for storing our pictures
            // this is its format
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "Chit-Chat");
            data.append("cloud_name", "ankushkhera09");
            fetch("https://api.cloudinary.com/v1_1/ankushkhera09/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())     // converting response to json
              .then(data => {
                setPic(data.url.toString());    // setting our pic url
                setLoading(false);  // pic uploaded successfully
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
              });
        }else{
            toast(
                {   
                    title: "Please select an image (jpeg/png)!",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                }
            );
            setLoading(false);
            return;
        }
    };
    
    // on form-submit
    const submitHandler = async (e) => {
        e.preventDefault();     // so that the page doesn't load on submit

        setLoading(true);

        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the Fields",
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
              title: "Passwords Do Not Match",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
            return;
        }

        // send data to the database
        try{
            const config = {
                headers:{
                    "Content-type": "application/json",
                }
            };

            const {data} = axios.post("http://localhost:5000/api/user", {name, email, password, pic}, config);
            
            toast({
                title: "User registered successfully :)",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");    // After sign up, take user to the chats page
        }catch(error){
            toast({
                title: "Internal Server Error, Try Again!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    return (
        // saari chizen vertically align hojaaye
        <VStack spacing="5px">
            {/* FormControl me ek ek element hoga */}
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your name" onChange={(event)=>setName(event.target.value)} />
            </FormControl>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input type={show ? "text" : "password"} placeholder="Enter password" onChange={(e)=>setPassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button size="sm" h="1.75rem" onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input type={show ? "text" : "password"} placeholder="Confirm password" onChange={(e) => setConfirmpassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="pic">
                <FormLabel>Upload your profile pic</FormLabel>
                <Input type="file" p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])} />
            </FormControl>

            <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    );
}

export default Signup;
