import prisma from "prisma/prisma";
import { redirect } from "react-router";
import type { Route } from "./+types/api.chat";

export async function action({ request }: Route.ActionArgs ) {
  const formData = await request.formData();
  const userMessage = formData.get("message") as string;
  const chatId = formData.get("chatId") as string;

  const chatMessage = {
    id: Date.now().toFixed(),
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
  }

  // biome-ignore lint/suspicious/noImplicitAnyLet: <todo>
  let chat;

  if (chatId) {
    const existingChat = await prisma.chat.findUnique({
      where: { id: chatId },
    })

    if (existingChat) {
      const existingMessages = JSON.parse(existingChat.content);
      
      chat = await prisma.chat.update({
        where: { id: chatId },
        data: {
          content: JSON.stringify([...existingMessages,chatMessage]),
        }
      }) 
    }

  } else {
    chat = await prisma.chat.create({
      data: {
        content: JSON.stringify([chatMessage]),
      }
    })
    return redirect(`/task/new?chat=${chat.id}`) 
  }
}