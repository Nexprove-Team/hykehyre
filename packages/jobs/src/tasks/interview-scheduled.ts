import { nanoid } from "nanoid";
import { tasks } from "@trigger.dev/sdk";
import { schemaTask } from "@trigger.dev/sdk";
import { render } from "@react-email/render";
import { resend } from "@jobs/utils/resend";
import { interviewScheduledSchema } from "@jobs/schema";
import { InterviewScheduledCandidateEmail } from "@hackhyre/email/emails/interview-scheduled-candidate";
import { InterviewScheduledRecruiterEmail } from "@hackhyre/email/emails/interview-scheduled-recruiter";

export const sendInterviewScheduledEmail = schemaTask({
  id: "send-interview-scheduled-email",
  schema: interviewScheduledSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async (payload) => {
    const {
      interviewId,
      candidateName,
      candidateEmail,
      recruiterName,
      recruiterEmail,
      companyName,
      jobTitle,
      scheduledAt,
      duration,
      meetLink,
      interviewType,
      notes,
    } = payload;

    // Format the scheduled time for display
    const formattedDate = new Date(scheduledAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = new Date(scheduledAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const formattedDateTime = `${formattedDate} at ${formattedTime}`;

    const typeLabel =
      interviewType.charAt(0).toUpperCase() + interviewType.slice(1);

    // Render both emails
    const [candidateHtml, recruiterHtml] = await Promise.all([
      render(
        InterviewScheduledCandidateEmail({
          candidateName,
          recruiterName,
          companyName,
          jobTitle,
          scheduledAt: formattedDateTime,
          duration,
          meetLink,
          interviewType: typeLabel,
          notes: notes ?? undefined,
        }),
      ),
      render(
        InterviewScheduledRecruiterEmail({
          recruiterName,
          candidateName,
          candidateEmail,
          jobTitle,
          scheduledAt: formattedDateTime,
          duration,
          meetLink,
          interviewType: typeLabel,
        }),
      ),
    ]);

    // Send both emails in parallel
    const results = await Promise.allSettled([
      resend.emails.send({
        headers: { "X-Entity-Ref-ID": nanoid() },
        from: "HackHyre <support@fynix.dev>",
        to: [candidateEmail],
        subject: `Interview Confirmed — ${jobTitle}`,
        html: candidateHtml,
      }),
      resend.emails.send({
        headers: { "X-Entity-Ref-ID": nanoid() },
        from: "HackHyre <support@fynix.dev>",
        to: [recruiterEmail],
        subject: `Interview Booked — ${candidateName} for ${jobTitle}`,
        html: recruiterHtml,
      }),
    ]);

    // Schedule reminder 30 minutes before interview
    const reminderAt = new Date(
      new Date(scheduledAt).getTime() - 30 * 60 * 1000,
    );

    if (reminderAt > new Date()) {
      await tasks.trigger("send-interview-reminder-email", {
        interviewId,
        candidateName,
        candidateEmail,
        recruiterName,
        recruiterEmail,
        jobTitle,
        startsAt: formattedTime,
        scheduledAt,
        duration,
        meetLink,
      }, { delay: reminderAt });
    }

    return {
      candidateEmailSent: results[0]?.status === "fulfilled",
      recruiterEmailSent: results[1]?.status === "fulfilled",
      reminderScheduled: reminderAt > new Date(),
    };
  },
});
