import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Bell } from "lucide-react";
import {
  GetNotifications,
  MarkNotificationAsRead,
} from "@/actions/notification";
import { GetBusinessId } from "@/actions/business";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";

interface Notification {
  id: number;
  formId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  businessId: number | null;
  isRead: boolean;
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [businessId, setBusinessId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchBusinessId() {
      const id = await GetBusinessId();
      setBusinessId(id);
    }
    fetchBusinessId();
  });

  useEffect(() => {
    async function fetchNotifications() {
      if (businessId) {
        const data = await GetNotifications(businessId);
        setNotifications(data);
      }
    }
    fetchNotifications();
  }, [businessId]);

  const handleMarkAsRead = async (notificationId: number) => {
    await MarkNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleNotificationClick = (formId: number | null) => {
    if (formId !== null) {
      router.push(`/appointment/${formId}`);
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 dark:text-gray-400"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">View notifications</span>
          {unreadCount > 0 && (
            <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="p-2">
              <div
                className="flex items-start space-x-2 cursor-pointer"
                onClick={() => {
                  handleNotificationClick(notification.formId);
                  handleMarkAsRead(notification.id);
                }}
              >
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${
                    notification.isRead ? "bg-transparent" : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex flex-col">
                    <span className="font-medium">New Appointment:</span>
                  <span className="dark:text-white">
                    {notification.content}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="text-center text-gray-500 dark:text-gray-400">
            No notifications available.
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => router.push("/notifications")}
          >
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
