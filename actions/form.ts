"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schema/form";
import { currentUser } from "@clerk/nextjs/server";
import { GetBusinessId } from "./business";

class UserNotFoundErr extends Error { }

export async function GetFormStats(formId?: number) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new UserNotFoundErr("User not found");
    }

    // Fetch the business ID for the current user
    const businessId = await GetBusinessId();
    if (!businessId) {
      throw new Error("Business ID not found for the current user");
    }

    // Count all scheduled, pending, and cancelled appointments for the business
    const allScheduledAppointments = await prisma.userDetails.count({
      where: {
        businessId,
        status: "schedule",
      },
    });

    const allPendingAppointments = await prisma.userDetails.count({
      where: {
        businessId,
        status: "pending",
      },
    });

    const allCancelledAppointments = await prisma.userDetails.count({
      where: {
        businessId,
        status: "cancelled",
      },
    });

    // Placeholder for form-specific stats
    let scheduledAppointments = 0;
    let pendingAppointments = 0;
    let cancelledAppointments = 0;
    let formVisitCount = 0;

    if (formId) {
      // Fetch the form's shareURL to filter userDetails
      const form = await prisma.form.findUnique({
        where: {
          id: formId,
          userId: user.id,
        },
        select: {
          shareURL: true,
          visitCount: true,
        },
      });

      if (form) {
        // Count scheduled, pending, and cancelled appointments for the specific form
        scheduledAppointments = await prisma.userDetails.count({
          where: {
            formShareURL: form.shareURL,
            status: "scheduled",
          },
        });

        pendingAppointments = await prisma.userDetails.count({
          where: {
            formShareURL: form.shareURL,
            status: "pending",
          },
        });

        cancelledAppointments = await prisma.userDetails.count({
          where: {
            formShareURL: form.shareURL,
            status: "cancelled",
          },
        });

        formVisitCount = form.visitCount || 0;
      }
    }

    // Count the total number of published forms for the user
    const publishedFormsCount = await prisma.form.count({
      where: {
        userId: user.id,
        published: true,
      },
    });

    return {
      // All forms stats
      allScheduledAppointments,
      allPendingAppointments,
      allCancelledAppointments,

      // Specific form stats (0 if formId is not provided)
      scheduledAppointments,
      pendingAppointments,
      cancelledAppointments,
      formVisitCount,

      // General stats
      publishedFormsCount,
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

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      totalAppointments: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.$transaction(async (prisma) => {
    const updatedForm = await prisma.form.update({
      data: {
        submissions: {
          increment: 1,
        },
        FormSubmissions: {
          create: {
            content,
          },
        },
      },
      where: {
        shareURL: formUrl,
        published: true,
      },
    });

    if (!updatedForm) {
      throw new Error("Form not found or not published.");
    }

    const { businessId } = updatedForm;

    if (!businessId) {
      throw new Error("Business ID not found in the form.");
    }

    await prisma.userDetails.update({
      where: {
        formShareURL: formUrl,
      },
      data: {
        businessId,
      },
    });

    return updatedForm;
  });
}

export async function GetFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}

export async function GetFormWithSubmissionByUserDetails(userDetailsId: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const userDetails = await prisma.userDetails.findUnique({
    where: {
      id: userDetailsId,
    },
    select: {
      formShareURL: true,
    },
  });

  if (!userDetails || !userDetails.formShareURL) {
    throw new Error("User details not found or formShareURL missing.");
  }

  // Fetch the form using the formShareURL
  const form = await prisma.form.findUnique({
    where: {
      shareURL: userDetails.formShareURL,
      userId: user.id, // Ensure the authenticated user owns the form
    },
    include: {
      FormSubmissions: true, // Include form submissions
    },
  });

  if (!form) {
    throw new Error("Form not found or unauthorized access.");
  }

  return form;
}


export async function DeleteFormById(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  try {
    // Check if the form exists and belongs to the current user
    const form = await prisma.form.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!form) {
      throw new Error("Form not found or does not belong to the current user.");
    }

    // Delete the form
    await prisma.form.delete({
      where: {
        id,
      },
    });

    return { success: true, message: "Form deleted successfully." };
  } catch (error) {
    console.error("Error in DeleteFormById:", error);
    throw error;
  }
}
