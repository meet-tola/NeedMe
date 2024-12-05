"use client";

import { DesignerContext } from "@/components/context/designer-context";
import { useContext } from "react";

export default function useDesigner() {
    const context = useContext(DesignerContext)

    if (!context) {
        throw new Error("useDesigner must be used within a Designer Context")
    }
    return context
}