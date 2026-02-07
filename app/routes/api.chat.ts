import prisma from "prisma/prisma";
import { redirect } from "react-router";
import { ChatMessageRole } from "~/generated/prisma/enums";
import { createChatMessage, getChatCompletion } from "~/services/chat.server";
import type { Route } from "./+types/api.chat";

export async function action({ request }: Route.ActionArgs ) {
  const formData = await request.formData();
  const userInput = formData.get("message") as string;
  const chatId = formData.get("chatId") as string;

  const userMessage = {
    role: ChatMessageRole.user,
    content: userInput,
  }

  // biome-ignore lint/suspicious/noImplicitAnyLet: <todo>
  let chat;

  if (chatId) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: true,
      },
    })

    if (chat) {
      
      const assistantMessage = {
        content: await getChatCompletion([...chat.messages, userMessage]) ?? "",
        role: ChatMessageRole.assistant,
      }

      await createChatMessage(chat.id, userMessage, assistantMessage);

    }

  } else {

    const assistantMessage = {
      role: ChatMessageRole.assistant,
      content: await getChatCompletion([userMessage]) ?? "",
    }

    chat = await prisma.chat.create({
      data: {
      }
    })

    await prisma.chatMessage.createMany(
      {
        data: [
          {
            chat_id: chat.id,
            ...userMessage,
          },
          {
            chat_id: chat.id,
            ...assistantMessage,
          }
        ]
      }
    )

    await createChatMessage(chat.id, userMessage, assistantMessage);

    return redirect(`/task/new?chat=${chat.id}`) 
  }
}