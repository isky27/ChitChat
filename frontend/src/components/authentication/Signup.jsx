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
import { useDispatch } from "react-redux";
import { authSignupPost } from "../../redux/auth.slice";
import { toast } from "react-toastify";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () =>
    setShowPassword((prevShow) => !prevShow);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      toast.error("Please fill in all fields and ensure passwords match.");
      return;
    }

    try {
      dispatch(authSignupPost({ name, email, password, pic }));
      toast.success("Signup successful!");
    } catch (error) {
      toast.error("Signup failed: " + error.message);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select a valid image file.");
      return;
    }

    setPicLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "user-uploads");
      formData.append("cloud_name", "dz4a5uxnf");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dz4a5uxnf/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setPic(data.url.toString());
    } catch (error) {
      toast.error("Image upload failed: " + error.message);
    } finally {
      setPicLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add form tag for submission handling */}
      <VStack spacing="5px">
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="signup-email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="new-password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic">
          <FormLabel>Upload Your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={handleImageUpload}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          mt={5}
          onClick={handleSubmit}
          isLoading={picLoading}
          disabled={picLoading}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};

export default Signup;
