import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);         // show-hide password
  const handleShow = () => setShow(!show);

  const [loading, setLoading] = useState(false);    // kind of boolean flag variable
  const toast = useToast();    // pop-up in chakra ui

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();     // so that the page doesn't load on submit

    setLoading(true);

    if (!email || !password) {
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

    // send data to the database
    try{
        const config = {
            headers:{
                "Content-type": "application/json",
            }
        };

        const {data} = axios.post("http://localhost:5000/api/user/login", {email, password}, config);
        
        toast({
            title: "User logged in successfully :)",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");    // After login, take user to the chats page
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
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
        Login
      </Button>
      
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;