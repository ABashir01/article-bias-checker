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
  Image
} from '@chakra-ui/react'
import { pipeline, env } from '@xenova/transformers';
import { HfInference } from '@huggingface/inference';


function App() {

  const [input, setInput] = useState('');
  const [classifier, setClassifier] = useState(null);
  const [invalidInput, setInvalidInput] = useState(false);

  const inference = new HfInference(process.env.REACT_APP_TOKEN);
  const model = "AhadB/bias-detector";


  // Initialize the classifier once on component mount
  // useEffect(() => {
  //   async function initializePipeline() {
  //     try {
  //       env.allowLocalModels = false;
  //       env.useBrowserCache = false;

  //       let loadedClassifier = await pipeline('text-classification', 'google-bert/bert-base-uncased');
  //       loadedClassifier = loadedClassifier.json();
  //       setClassifier(loadedClassifier);
  //     } catch (error) {
  //       console.error('Error initializing pipeline:', error);
  //     }
  //   }
  //   initializePipeline();
  // }, []);

  

  const handleChange = ((e) => {
    setInput(e.target.value);
  })

  const handleSubmit = (async (e) => {
    e.preventDefault();

    // if (input === "") {
    //   setInvalidInput(true);
    // } else {
    //   const result = await inference.textClassification({
    //     model: model,
    //     inputs: input,
    //   });

    console.log("input: ", input);
    const url = 'http://localhost:8000/predict/';

    try {

      const data = {
        text: input,
      };

      const response = await axios.post(url, data);

      console.log("Response data: ", response.data);

    } catch (err) {
      console.error("Error was: ", err);
    }
    

    

    
    // const classifier = await pipeline('text-classification', 'C:/Users/ahadb/Desktop/bias_data_model_results_6_best_model_onnx');
    
    // const tokenizer_kwargs = {'padding':true,'truncation':true,'max_length':512}
    // let result = await(classifier("Hello, this is an example"));

    // console.log("result: ", result.toString());
  });

  return (
    <Flex w={"100vw"} h={"100vh"} flexDir={"column"} alignItems={"center"} bgColor={"#FFFFFB"}>
 
      <Flex  w={"100%"} h={"12%"} flexDir={"row"} alignItems={"center"} justifyContent={"space-between"} p={"2%"} borderBottom={"1px solid"} borderColor={"black"}> {/* Header Box */}
        <Heading as='h1' size={"lg"} color={"green.500"}>Political Bias Checker</Heading>
        <HStack w={"12%"} h={"80%"} justifyContent={"space-between"}>
          <Link fontSize={"xl"} href='https://www.wikipedia.com' isExternal>Github</Link>
          <Link href="https://www.ahadbashir.com" isExternal><Image h={"8vh"} objectFit={"cover"}  src={process.env.PUBLIC_URL + 'Ahad Logo.png '}/></Link>
        </HStack>
        
      </Flex>

      <Flex w={"70%"} h={"90%"} flexDir={"column"} alignItems={"center"}> {/* Content Box */}
        <Flex w={"100%"} h={"20%"} flexDir={"row"} alignItems={"center"}>
          <Text fontSize={"xl"} noOfLines={3}>
            <Text as={"strong"}>Political Bias Checker</Text> uses an AI model trained on 700,000+ (mostly 
            American) news articles to determine the political bias 
            of a given piece of text. This model was made possible thanks to 
            the <Link fontWeight={700} href='https://arxiv.org/abs/2203.05659' isExternal>NELA-GT-2022→</Link>
            &nbsp;dataset created by Maurício Gruppi, Benjamin D. Horne, and Sibel Adalı, as well as&nbsp;
            <Link fontWeight={700} href='https://www.allsides.com/' isExternal>AllSides→</Link>.
          </Text>
        </Flex>
        

        <Flex w={"100%"} h={"80%"} flexDir={"column"} alignItems={"center"}> {/* Results + Input Box */}
          <Flex w={"100%"} h={"10%"} flexDir={"column"} alignItems={"center"}> {/* Results Box */}

          </Flex>
          <FormControl  w={"100%"} h={"90%"} flexDir={"column"} alignItems={"center"}>
            <Flex w={"100%"} h={"100%"} flexDir={"column"} alignItems={"center"}>

              <Textarea onChange={handleChange} 
                w={"100%"} h={"70%"} 
                flexDir={"column"} 
                alignItems={"center"}  
                bgColor={"white"} 
                borderColor={"black"} 
                focusBorderColor='green.500'
                fontSize={"lg"}
              />

              <Button type='submit' w={"25%"} h={"15%"} colorScheme={'green'} fontSize={"2xl"} marginTop={"3%"} onClick={handleSubmit}>
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
