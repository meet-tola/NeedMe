"use server";

import prisma from "@/lib/prisma";
import { businessSchema, BusinessFormData } from "@/schema/business";
import { currentUser } from "@clerk/nextjs/server";

class UserNotFoundError extends Error {}

export async function CreateBusiness(data: BusinessFormData) {
    const validation = businessSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Invalid form data");
    }

    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundError("User not found");
    }

    const { name, description, contactInfo, address, operatingHours, logoUrl } = data;

    const business = await prisma.business.create({
        data: {
            name,
            description,
            contactInfo,
            address,
            operatingHours,
            logoURL: logoUrl || null,
            userId: user.id, 
        },
    });

    if (!business) {
        throw new Error("Failed to create business");
    }

    return business.id;
}


export async function GetBusinessId() {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }

    const business = await prisma.business.findFirst({
        where: {
            userId: user.id, 
        },
    });

    if (!business) {
        throw new Error("No business found for the user");
    }

    return business.id;
}

export async function GetBusinessByUserId() {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const business = await prisma.business.findFirst({
            where: {
                userId: user.id, 
            },
        });

        if (!business) {
            throw new Error("No business profile found for the given user");
        }

        return business;
    } catch (error) {
        throw new Error("Failed to retrieve business profile");
    }
}

