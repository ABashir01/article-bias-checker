import {useState, useEffect} from 'react';
import axios from 'axios';

import {
  Box,
  Flex,
  Button,
  HStack,
  Link,
  Text,
  Input,
  FormControl,
  Textarea,
  Heading,
  Image,
  Spinner,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  IconButton
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';


function App() {

  const [input, setInput] = useState('');
  const [invalidInput, setInvalidInput] = useState(false);
  const [biasLabel, setBiasLabel] = useState("");
  const [biasScore, setBiasScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);

  const {isOpen, onOpen, onClose} = useDisclosure();


  const handleChange = ((e) => {
    setInput(e.target.value);
  })

  const handleSubmit = (async (e) => {
    e.preventDefault();

    if (input === "") {
      setInvalidInput(true);
    } else {

      setInvalidInput(false);
      setLoadingScore(true);

      

      console.log("input: ", input);
      const url = process.env.REACT_APP_API_URL;

      try {

        // Replace all quotation marks in case they interfere with string
        setInput(input.replaceAll('"',''));
        setInput(input.replaceAll("'", ""));

        const data = {
          text: input,
        };

        const response = await axios.post(url, data);

        let score = response.data * 5;

        // Score can't leave -5 to 5 range
        if (score > 5.0) {
          score = 5.0;
        } else if (score < -5.0) {
          score = -5.0;
        }

        // Set the bias score
        setBiasScore(score.toFixed(2));

        // Set label value from score
        if (score >= -5.0 && score < -3.0) {
          setBiasLabel("Further Left");
        } else if (score >= -3.0 && score < -1.0) {
          setBiasLabel("Left");
        } else if (score >= -1.0 && score <= 1.0) {
          setBiasLabel("Center")
        } else if (score > 1.0 && score <= 3.0) {
          setBiasLabel("Right");
        } else if (score > 3.0 && score <= 5.0) {
          setBiasLabel("Further Right");
        }

        setLoadingScore(false);

        console.log("Response data: ", response.data);

      } catch (err) {
        console.error("Error was: ", err);
      }
    }

  });

  return (
    <Flex w={"100vw"} h={"100vh"} flexDir={"column"} alignItems={"center"} bgColor={"#FFFFFB"}>
 
      <Flex  w={"100%"} h={"12%"} flexDir={"row"} alignItems={"center"} justifyContent={"space-between"} p={["3%", null, null, "2%"]} borderBottom={"1px solid"} borderColor={"black"} marginBottom={["2%", null, null, "1%"]}> {/* Header Box */}
        <Heading as='h1' size={["md", null, null, "lg"]} color={"green.500"}>Political Bias Checker</Heading>
        <HStack w={"12%"} h={"80%"} justifyContent={["space-between"]} display={["none", null, null, "flex"]}>
          <Link fontSize={["md", null, null, "xl"]} href='https://github.com/ABashir01/article-bias-checker' isExternal>Github</Link>
          <Link href="https://www.ahadbashir.com" isExternal><Image h={["2vh", null, null, "8vh"]} objectFit={"cover"}  src={process.env.PUBLIC_URL + 'Ahad Logo.png '}/></Link>
        </HStack>
        <IconButton 
              aria-label='Open Menu'
              icon={<HamburgerIcon />}
              display={["flex", 0, 0, "none"]}
              onClick={onOpen}
            />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader></DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody h={"100vh"}>
            <Flex flexDir={"column"} h={"30vh"} fontWeight={300} fontSize={"3xl"} justifyContent={"space-around"}>
              <Link fontSize={["3xl"]} href='https://www.wikipedia.com' isExternal>Github</Link>
              <Link href="https://www.ahadbashir.com" isExternal><Image h={["10vh", null, null, "8vh"]} objectFit={"cover"}  src={process.env.PUBLIC_URL + 'Ahad Logo.png '}/></Link>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex w={["90%", null, null, "70%"]} h={"90%"} flexDir={"column"} alignItems={"center"}> {/* Content Box */}
        <Flex w={"100%"} h={"20%"} flexDir={"row"} alignItems={"center"} marginBottom={["2%", null, null, "1%"]}>
          <Text fontSize={["sm", null, null, "xl"]} noOfLines={[7, null, null, 3]}>
            <Text as={"strong"}>Political Bias Checker</Text> uses an AI model trained on 700,000+ (mostly 
            American) news articles to determine the political bias 
            of a submitted piece of text. This model was made possible thanks to 
            the <Link fontWeight={700} href='https://arxiv.org/abs/2203.05659' isExternal>NELA-GT-2022→</Link>
            &nbsp;dataset created by Maurício Gruppi, Benjamin D. Horne, and Sibel Adalı, as well as&nbsp;
            <Link fontWeight={700} href='https://www.allsides.com/' isExternal>AllSides→</Link>.
          </Text>
        </Flex>


        

        <Flex w={"100%"} h={"80%"} flexDir={"column"} alignItems={"center"}> {/* Results + Input Box */}

          {loadingScore || biasLabel ? 
          <Flex w={"100%"} h={"35%"} flexDir={"column"} alignItems={"center"} boxShadow="sm" borderRadius="xl" border={"1px solid"} bgColor={"white"} p={"2%"} marginBottom={["2%", null, null, "1%"]}> {/* Results Box */}
            {!loadingScore ? <Box><Heading as='h3' size={['xs', null, null, 'md']}>This text seems to lean (Further Left / Left / Center / Right / Further Right):</Heading>
            <Text fontSize={['sm', null, null, 'lg']} m={"1%"}>{biasLabel}</Text>
            <Heading as='h3' size={['xs', null, null, 'md']}>On a scale from -5 to 5 (-5: furthest left / 0: neutral / 5: furthest right), this text received a score of:</Heading>
            <Text fontSize={['sm', null, null, 'lg']} m={"1%"}>{biasScore}</Text></Box> : <Spinner />}
            
          </Flex>

          : <Flex w={"100%"} h={"30%"} flexDir={"column"} alignItems={"center"} p={"2%"} bgColor={"#FFFFFB"} marginBottom={"1%"} border={"1px solid"} borderColor={"#FFFFFB"}></Flex>}
          
          <FormControl  w={"100%"} h={"90%"} flexDir={"column"} alignItems={"center"}>
            <Flex w={"100%"} h={"100%"} flexDir={"column"} alignItems={"center"}>

              <Textarea onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }} 
                w={"100%"} h={"70%"} 
                flexDir={"column"} 
                alignItems={"center"}  
                bgColor={"white"} 
                borderColor={"black"} 
                focusBorderColor='green.500'
                fontSize={["sm", null, null, "lg"]}
              />

              <Button type='submit' w={["100%", null, null, "25%"]} h={"15%"} colorScheme={'green'} fontSize={"2xl"} marginTop={"2%"} onClick={handleSubmit}>
                Submit
              </Button>
            </Flex>
            
          </FormControl>
        </Flex>

      </Flex>

    </Flex>
  );
}

export default App;
