import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authLoginPost } from "../../redux/auth.slice";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => setShowPassword((prevShow) => !prevShow);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
      dispatch(authLoginPost({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}> {/* Add form tag for submission handling */}
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleTogglePasswordVisibility}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          mt={5}
          isLoading={isAuthLoading}
          disabled={isAuthLoading} 
          onClick={handleSubmit}
        >
          Login
        </Button>
      </VStack>
    </form>
  );
};

export default Login;