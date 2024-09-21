'use client';

import React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export const GoBackBtn: React.FC = () => {
    const router = useRouter();

    return (
        <Button
            className="text-sm"
            color="primary"
            radius="full"
            size="lg"
            variant="shadow"
            onClick={router.back}
        >
            <span>Go Back</span>
            <Icons.undo/>
        </Button>
    )
}