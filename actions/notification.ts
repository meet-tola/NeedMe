"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GetNotifications(businessId: number) {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

    return await prisma.notification.findMany({
      where: {
        OR: [
          { businessId },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  export async function MarkNotificationAsRead(notificationId: number) {
    return await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }
  
  