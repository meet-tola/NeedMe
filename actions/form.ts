"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schema/form";
import { currentUser } from "@clerk/nextjs/server";
import { GetBusinessId } from "./business";

class UserNotFoundErr extends Error { }

export async function GetFormStats() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new UserNotFoundErr("User not found");
        }

        // Fetch all forms for the user
        const forms = await prisma.form.findMany({
            where: {
                userId: user.id,
            },
            select: {
                totalAppointments: true,
                submissions: true,
            },
        });

        // Calculate the total appointments and submissions
        let totalAppointments = 0;
        let submissions = 0;

        forms.forEach(form => {
            totalAppointments += form.totalAppointments || 0;
            submissions += form.submissions || 0;
        });

        // Calculate the total divided by 10
        const submissionsRate = (totalAppointments + submissions) / 10;
        const bounceRate = (totalAppointments + submissions) / 20;

        return {
            totalAppointments,
            submissions,
            submissionsRate,
            bounceRate
        };
    } catch (error) {
        console.error("Error in GetFormStats:", error);
        throw error;
    }
}
export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Form not valid");
    }

    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundErr();
    }

    const businessId = await GetBusinessId();

    const { name, description } = data;

    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name,
            description,
            business: {
                connect: { id: businessId },
            },
        },
    });

    if (!form) {
        throw new Error("Something went wrong");
    }

    return form.id;
}

export async function GetForms() {
    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundErr()
    }

    return await prisma.form.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function GetFormById(id: number) {
    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundErr()
    }

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        }
    })
}