"use server"

import { z } from "zod"
import { connectDB } from "@/lib/mongoose"
import { Waitlist } from "@/lib/models/waitlist"

const schema = z.object({
    fullName: z.string().min(2),
    email: z.email(),
    agreedToTerms: z.literal(true),
})

export async function joinWaitlist(data: z.infer<typeof schema>) {
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
        return { success: false, error: "Invalid form data." }
    }

    await connectDB()

    const exists = await Waitlist.findOne({ email: parsed.data.email })
    if (exists) {
        return { success: false, error: "This email is already on the waitlist." }
    }

    await Waitlist.create(parsed.data)
    return { success: true }
}
