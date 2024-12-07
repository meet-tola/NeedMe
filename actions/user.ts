import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { userSchema, UserSchemaType } from "@/schema/users";

export async function StoreFormDetails(data: UserSchemaType) {
    const validation = userSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Form not valid");
    }

    const { name, email, phone, formId } = data;
    const form = await prisma.form.findUnique({
        where: { id: formId },
    });

    if (!form) {
        throw new Error("Form not found or unauthorized access");
    }

    return await prisma.userDetails.create({
        data: {
            formId,
            name,
            email,
            phone,
        },
    });
}

export async function GetUserDetails(formId: number) {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

    const form = await prisma.form.findUnique({
        where: { id: formId, userId: user.id },
    });

    if (!form) {
        throw new Error("Form not found or unauthorized access");
    }

    return await prisma.userDetails.findMany({
        where: { formId },
        orderBy: { createdAt: "desc" },
    });
}
