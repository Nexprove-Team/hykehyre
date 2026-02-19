import { nanoid } from "nanoid";
import { tasks } from "@trigger.dev/sdk";
import { schemaTask } from "@trigger.dev/sdk";
import { render } from "@react-email/render";
import { resend } from "@jobs/utils/resend";
import { interviewScheduledSchema } from "@jobs/schema";
import { InterviewScheduledCandidateEmail } from "@hackhyre/email/emails/interview-scheduled-candidate";
import { InterviewScheduledRecruiterEmail } from "@hackhyre/email/emails/interview-scheduled-recruiter";
import { format } from "date-fns";

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

    const formattedDate = format(new Date(scheduledAt), "EEEE, MMM d, yyyy");
    const formattedTime = format(new Date(scheduledAt), "h:mm a");
    const formattedDateTime = `${formattedDate} at ${formattedTime}`;

    const typeLabel =
      interviewType.charAt(0).toUpperCase() + interviewType.slice(1);

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
