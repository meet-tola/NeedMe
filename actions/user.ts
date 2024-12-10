"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { userSchema, UserSchemaType } from "@/schema/users";

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

export async function ScheduleAppointment(formShareURL: string, id: number) {
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

    return await prisma.userDetails.update({
        where: { id },
        data: { status: "approved" },
    });
}

export async function CancelAppointment(formShareURL: string, id: number) {
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

    return await prisma.userDetails.update({
        where: { id },
        data: { status: "canceled" },
    });
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
