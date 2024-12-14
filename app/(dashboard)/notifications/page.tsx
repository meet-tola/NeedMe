"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserIcon } from 'lucide-react';
import { GetNotifications, MarkNotificationAsRead } from "@/actions/notification";
import { GetBusinessId } from "@/actions/business";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Notification {
  id: number;
  formId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  businessId: number | null;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBusinessId() {
      const id = await GetBusinessId();
      setBusinessId(id);
    }
    fetchBusinessId();
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      if (businessId) {
        setIsLoading(true);
        const data = await GetNotifications(businessId);
        setNotifications(data);
        setIsLoading(false);
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

  return (
    <div className="w-full max-w-2xl flex flex-col mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Notifications</h1>
      <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <ScrollArea className="h-[70vh] md:h-[60vh] lg:h-[70vh] w-full">
          <div className="p-4 space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <NotificationSkeleton key={index} />
              ))
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onNotificationClick={handleNotificationClick}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No notifications available.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onNotificationClick,
}: {
  notification: Notification;
  onMarkAsRead: (notificationId: number) => void;
  onNotificationClick: (formId: number | null) => void;
}) {
  return (
    <div
      className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-200 ${
        notification.isRead 
          ? "bg-gray-50 dark:bg-gray-700" 
          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
      onClick={() => {
        onMarkAsRead(notification.id);
        onNotificationClick(notification.formId);
      }}
    >
      <div className="flex items-start sm:items-center space-x-4 flex-grow">
        <div
          className={`w-3 h-3 rounded-full mt-1 ${
            notification.isRead ? "bg-gray-300 dark:bg-gray-500" : "bg-blue-500"
          }`}
        ></div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
            New Appointment
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <UserIcon className="mr-2 h-4 w-4 opacity-70" />
            {notification.content}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <button
        className="mt-3 sm:mt-0 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200 sm:ml-4"
      >
        View Appointment
      </button>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
      <div className="flex items-start sm:items-center space-x-4 w-full">
        <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-3 sm:mt-0 h-6 bg-gray-200 dark:bg-gray-600 rounded w-24 sm:ml-4"></div>
    </div>
  );
}

