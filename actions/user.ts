"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { userSchema, UserSchemaType } from "@/schema/users";
import { render } from "@react-email/components";
import UserEmail from "@/components/email-template/user-email";
import { sendEmail } from "./email";

export async function CreateUserDetails(data: UserSchemaType) {
  const validation = userSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Form not valid");
  }

  const { name, email, phone, formShareURL } = data;
  const form = await prisma.form.findUnique({
    where: {
      shareURL: formShareURL,
      published: true,
    },
  });

  if (!form) {
    throw new Error("Form not found or unauthorized access");
  }

  // Return the created UserDetails entry, including its id
  const userDetails = await prisma.userDetails.create({
    data: {
      formShareURL,
      name,
      email,
      phone,
      status: "pending",
    },
  });

  return userDetails;
}

export async function GetUserDetails(formShareURL: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const form = await prisma.form.findUnique({
    where: { shareURL: formShareURL, userId: user.id },
  });

  if (!form) {
    throw new Error("Form not found or unauthorized access");
  }

  return await prisma.userDetails.findMany({
    where: { formShareURL },
    orderBy: { createdAt: "desc" },
  });
}

export async function ScheduleAppointment(formShareURL: string, id: number, additionalMessage: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const form = await prisma.form.findUnique({
    where: { shareURL: formShareURL, userId: user.id },
  });

  if (!form) {
    throw new Error("Form not found or unauthorized access");
  }

  const updatedUserDetails = await prisma.userDetails.update({
    where: { id },
    data: { status: "scheduled" },
  });

  const userDetails = await prisma.userDetails.findUnique({ where: { id } });
  if (!userDetails || !userDetails.email) {
    throw new Error("User details or email not found");
  }

  const business = await prisma.business.findUnique({
    where: { id: form.businessId },
  });

  if (!business || !business.name) {
    throw new Error("Business details not found");
  }

  const emailContent = await render(
    UserEmail({
      businessName: business.name,
      userName: userDetails.name || "Anonymous",
      formTitle: form.name,
      status: "Scheduled",
      additionalMessage,
    })
  );

  sendEmail(
        "Talktrack <support@talktrack.com>",
        userDetails.email,
        "Your Appointment Has Been Scheduled",
        emailContent
    );

  return updatedUserDetails;
}

export async function CancelAppointment(formShareURL: string, id: number, additionalMessage: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const form = await prisma.form.findUnique({
    where: { shareURL: formShareURL, userId: user.id },
  });

  if (!form) {
    throw new Error("Form not found or unauthorized access");
  }

  const updatedUserDetails = await prisma.userDetails.update({
    where: { id },
    data: { status: "cancelled" },
  });

  const userDetails = await prisma.userDetails.findUnique({ where: { id } });
  if (!userDetails || !userDetails.email) {
    throw new Error("User details or email not found");
  }

  const business = await prisma.business.findUnique({
    where: { id: form.businessId },
  });

  if (!business || !business.name) {
    throw new Error("Business details not found");
  }

  const emailContent = await render(
    UserEmail({
      businessName: business.name,
      userName: userDetails.name || "Anonymous",
      formTitle: form.name,
      status: "Cancelled",
      additionalMessage
    })
  );

  sendEmail(
        "Talktrack <support@talktrack.com>",
        userDetails.email,
        "Your Appointment Has Been Cancelled",
        emailContent
    );

  return updatedUserDetails;
}

export async function DeleteUserDetails(formShareURL: string, id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const form = await prisma.form.findFirst({
    where: { shareURL: formShareURL, userId: user.id },
  });

  if (!form) {
    throw new Error("Form not found or unauthorized access");
  }

  await prisma.formSubmissions.deleteMany({
    where: { userDetailsId: id },
  });

  return await prisma.userDetails.delete({
    where: { id },
  });
}


