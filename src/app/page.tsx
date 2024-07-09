"use client";

import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { PdfJs, ProgressBar, Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Navbar from "./components/Navbar";

import {
  toolbarPlugin,
  type ToolbarSlot,
  type TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import MessageInput from "./components/MessageInput";
import { MessageArray } from "./assets/interfaces";
import UserMessage from "./components/UserMessage";
import BotMessage from "./components/BotMessage";
import { storage } from "./utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import getUser from "./server/getUser";
import { redirect } from "next/navigation";
import { useUser } from "./context/context";
import axios from "axios";
import { createChunks } from "./server/createChunks";
import { PDFDocument } from "pdf-lib";

const Page = () => {
  const [pdfFile, setPDFFile] = useState<string | Uint8Array | null>(null);
  const [viewPDF, setViewPDF] = useState<string | Uint8Array | null>("");
  const [selection, setSelection] = useState<string | null>(null);
  const [databaseName, setDatabaseName] = useState<string | null>("");
  const [uploadingPDF, setUploadingPDF] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [resLoading, setResLoading] = useState<boolean>(false);
  const [buttonPosition, setButtonPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [messagesArray, setMessagesArray] = useState<MessageArray[]>([
    {
      message:
        "Welcome to PDF Chat! 📚✨ This app allows you to upload any PDF and chat directly with its content, making it easy to extract information quickly and efficiently. Enjoy features like document summarization to grasp key points quickly, and an interactive Q&A system for any questions you have about the content. Experience a seamless, user-friendly interface designed to enhance your reading and interaction. Upload a PDF to get started and explore these exciting features. Happy chatting!",
      role: "model",
    },
  ]);

  const [chatId, setChatId] = useState<string>(""); // Chat id
  const [loadingMessages, setLoadingMessages] = useState<string[]>([
    "Processing your document",
    "Extracting text from PDF",
    "Generating Chunks",
    "Generating vectors",
    "Saving vectors securely",
    "Almost ready...",
  ]);

  const scrollToBottom = () => {
    // Assuming your chat container has an id="chatContainer"
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (uploadingPDF) {
      setCurrentMessageIndex(0); // Reset to the first message
      intervalId = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          if (prevIndex < loadingMessages.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(intervalId);
            return prevIndex;
          }
        });
      }, 6500); // Change message every 5 seconds
    }

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [uploadingPDF, loadingMessages.length]);

  const { user, setUser } = useUser();

  const createNewChat = async (pdfUrl: string, dbName: string) => {
    try {
      console.log("Creating new chat");
      console.log(pdfUrl);
      console.log(dbName);

      const { data } = await axios.post("/api/users/pdf", {
        userId: user?.user.id,
        pdfURL: pdfUrl,
        databaseName: dbName,
      });
      console.log(data.message._id);
      setChatId(data?.message?._id);
    } catch (e) {
      console.log(e);
    }
  };

  const fileType = ["application/pdf"];
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    EnterFullScreen: () => <></>,
    SwitchTheme: () => <></>,
  });

  const uploadPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingPDF(true);
    const selectedFile = e.target.files?.[0];
    const formData = new FormData();
    formData.append("pdf", selectedFile!);

    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });
    var data = await response.json();
    console.log(data);
    setDatabaseName(data.message);

    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const storageRef = ref(storage, `pdfs/${selectedFile?.name}`);
      await uploadBytes(storageRef, selectedFile!);
      const downloadURL = await getDownloadURL(storageRef);
      console.log(downloadURL);
      setViewPDF(`${proxyUrl}${downloadURL}`);
      createNewChat(`${proxyUrl}${downloadURL}`, data?.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploadingPDF(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesArray]);

  const chatWithPdf = async () => {
    setResLoading(true);
    if (
      messagesArray[0].message ===
      "Welcome to PDF Chat! 📚✨ This app allows you to upload any PDF and chat directly with its content, making it easy to extract information quickly and efficiently. Enjoy features like document summarization to grasp key points quickly, and an interactive Q&A system for any questions you have about the content. Experience a seamless, user-friendly interface designed to enhance your reading and interaction. Upload a PDF to get started and explore these exciting features. Happy chatting!"
    ) {
      setMessagesArray([]);
    }
    setMessagesArray((prevVal) => {
      return [...prevVal, { role: "user", message: message }];
    });
    try {
      let { data } = await axios.post("/api/chat", {
        chatId,
        message,
        databaseName,
      });
      console.log(data.message);
      setMessagesArray((prevVal) => {
        return [...prevVal, { role: "model", message: data.message }];
      });
    } catch (e) {
      console.log(e);
    } finally {
      setResLoading(false);
    }
  };

  useEffect(() => {
    // This is the code that should be changed
    const handleMouseUp = (event: MouseEvent) => {
      const selectedText = window.getSelection()?.toString();
      if (selectedText && selectedText.length > 5) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let node = range.commonAncestorContainer as Node;
          while (node && node.nodeType === 1) {
            const element = node as HTMLElement;
            if (element.classList.contains("rpv-core__text-layer")) {
              setSelection(selectedText);
              setButtonPosition({ x: event.pageX, y: event.pageY });
              return;
            }
            node = node.parentElement as Node;
          }
        }
      }
      setSelection(null);
      setButtonPosition(null);
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // This is the code that should be changed
  }, []);

  const logSelection = () => {
    if (selection) {
      setMessage("Summarize : " + selection);
      window.getSelection()?.removeAllRanges(); // Unselect the text
      setSelection(null);
      setButtonPosition(null);
    }
  };

  return (
    <Box w={"100vw"} minH={"100vh"} bgColor={"#F8F5EE"}>
      <Navbar />
      <HStack w={"100%"} minH={"100%"} alignItems={"flex-start"}>
        {/* Left Side */}
        <VStack
          w={"40%"}
          minH={"100%"}
          borderRight={"1px solid #e9e9e9"}
          borderTop={"1px solid #e9e9e9"}
          bgColor={"#fff"}
        >
          <Box w={"100%"} h={"100vh"} overflow={"hidden"}>
            {!viewPDF && !uploadingPDF && (
              <Box
                w={"100%"}
                h={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                pb={"4rem"}
                cursor={"pointer"}
                onClick={() => {
                  document.getElementById("uploadFile")?.click();
                }}
              >
                <Text color={"#c9c9c9"} fontSize={"1rem"}>
                  Get started by uploading your PDF!
                </Text>
              </Box>
            )}
            {uploadingPDF && (
              <Box
                w={"100%"}
                h={"100%"}
                display={"flex"}
                justifyContent={"center"}
                flexDir={"column"}
                alignItems={"center"}
                pb={"5rem"}
                gap={"0.5rem"}
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="#fa9170"
                  size="xl"
                />
                <Text fontSize={"0.8rem"}>
                  {loadingMessages[currentMessageIndex]}
                </Text>
              </Box>
            )}
            {viewPDF && <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>}
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {viewPDF && (
                <Viewer
                  fileUrl={viewPDF}
                  renderLoader={(percentages: number): any => {
                    return (
                      <div style={{ width: "240px" }}>
                        <ProgressBar progress={Math.round(percentages)} />
                      </div>
                    );
                  }}
                  plugins={[toolbarPluginInstance]}
                />
              )}
            </Worker>
          </Box>
        </VStack>
        {/* Right Side */}
        <VStack w={"60%"} minH={"100%"} borderLeft={"1px solid #e9e9e9"}>
          <Box
            w={"100%"}
            h={"27.5rem"}
            bgColor={"#fff"}
            overflowY={"scroll"}
            borderBottom={"1px solid #e5e5e5"}
            id="chatContainer"
          >
            <Box display={"flex"} flexDir={"column"}>
              {messagesArray.map((e) => {
                if (e.role === "user") {
                  return <UserMessage message={e.message} />;
                } else {
                  return <BotMessage message={e.message} />;
                }
              })}
              {resLoading && <BotMessage message={"!@#$%"} />}
            </Box>
          </Box>
          {/* here */}
          <MessageInput
            uploadPDF={uploadPDF}
            viewPDF={viewPDF}
            setMessagesArray={setMessagesArray}
            setMessage={setMessage}
            message={message}
            chatWithPdf={chatWithPdf}
            resLoading={resLoading}
          />
          {/* <Text>Right Side</Text>
          <Box>
            <Input type="file" onChange={uploadPDF} />
            <Button colorScheme="blue" onClick={renderPdf}>
              Submit
            </Button>
          </Box> */}
        </VStack>
      </HStack>
      {buttonPosition && (
        <Button
          ref={buttonRef}
          style={{
            position: "absolute",
            left: buttonPosition.x,
            top: buttonPosition.y,
          }}
          onClick={logSelection}
        >
          Log Selection
        </Button>
      )}
    </Box>
  );
};

export default Page;
