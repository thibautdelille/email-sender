import {
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import { useState } from 'react';
import { useSignIn } from '../api/signIn';
import { useSignInWithGoogle } from '../api/signInWithGoogle';
import { useRegister } from '../api/register';

function PasswordInput({
  placeholder,
  onChange,
}: {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        onChange={onChange}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const register = useRegister();
  const signIn = useSignIn();
  const signInWithGoogle = useSignInWithGoogle();

  const handleSignIn = () => {
    if (!email) {
      setEmailError('Email is required');
      setIsEmailError(true);
      return;
    }
    // validate email
    if (!email.includes('@')) {
      setEmailError('Invalid email');
      setIsEmailError(true);
      return;
    }
    setEmailError('');
    setIsEmailError(false);

    if (!password) {
      setPasswordError('Password is required');
      setIsPasswordError(true);
      return;
    }
    setPasswordError('');
    setIsPasswordError(false);

    signIn.mutate({ email, password });
  };
  const handleRegister = () => {
    if (!email) {
      setEmailError('Email is required');
      setIsEmailError(true);
      return;
    }
    // validate email
    if (!email.includes('@')) {
      setEmailError('Invalid email');
      setIsEmailError(true);
      return;
    }
    setEmailError('');
    setIsEmailError(false);
    // verify password and confirm password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setIsPasswordError(true);
      return;
    }

    // password length validation
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setIsPasswordError(true);
      return;
    }
    setPasswordError('');
    setIsPasswordError(false);

    register.mutate({ email, password });
  };
  return (
    <Flex width="100%" height="100%" align="center" justify="center">
      <Card>
        <CardBody>
          <Flex direction={'column'} gap={4}>
            <Tabs
              onChange={() => {
                setEmailError('');
                setIsEmailError(false);
                setPasswordError('');
                setIsPasswordError(false);
              }}
            >
              <TabList>
                <Tab>Log in</Tab>
                <Tab>Register</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Flex direction={'column'} gap={4}>
                    <FormControl isInvalid={isEmailError}>
                      <Input
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {isEmailError && (
                        <FormErrorMessage>{emailError}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={isPasswordError}>
                      <PasswordInput
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {isPasswordError && (
                        <FormErrorMessage>{passwordError}</FormErrorMessage>
                      )}
                    </FormControl>
                    <Button onClick={handleSignIn}>Sign In</Button>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction={'column'} gap={4}>
                    <FormControl isInvalid={isEmailError}>
                      <Input
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {isEmailError && (
                        <FormErrorMessage>{emailError}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={isPasswordError}>
                      <Flex direction={'column'} gap={4}>
                        <PasswordInput
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <PasswordInput
                          placeholder="Confirm Password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </Flex>
                      {isPasswordError && (
                        <FormErrorMessage>{passwordError}</FormErrorMessage>
                      )}
                    </FormControl>
                    <Button onClick={handleRegister}>Register</Button>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Divider />
            <Button onClick={() => signInWithGoogle.mutate()}>
              Sign In With Google
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};
