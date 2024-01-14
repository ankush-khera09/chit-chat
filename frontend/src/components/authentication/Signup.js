import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);     // show-hide password
    const handleShow = () => setShow(!show);

    const postDetails = () => {};
    
    const submitHandler = () => {};

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

            <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler}>
                Sign Up
            </Button>
        </VStack>
    );
}

export default Signup;
