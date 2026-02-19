import {
  Button,
  Container,
  Heading,
  Hr,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import EmailContainer from "../components/container";

interface InterviewReminderEmailProps {
  recipientName: string;
  otherPartyName: string;
  jobTitle: string;
  startsAt: string;
  duration: number;
  meetLink: string | null;
  role: "recruiter" | "candidate";
}

export default function InterviewReminderEmail({
  recipientName,
  otherPartyName,
  jobTitle,
  startsAt,
  duration,
  meetLink,
  role,
}: InterviewReminderEmailProps) {
  const otherLabel = role === "recruiter" ? "Candidate" : "Interviewer";

  return (
    <EmailContainer
      preview={
        <Preview>
          Your interview for {jobTitle} starts in 30 minutes
        </Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 rounded-lg border-solid border-gray-200 bg-white px-10 py-8">
        <Section className="mt-4 mb-8">
          <Text className="font-display m-0 text-7 font-bold tracking-tight text-brand-black">
            Hack<span className="text-brand-green">Hyre</span>
          </Text>
        </Section>

        <Heading className="font-display m-0 mb-4 text-7 font-bold text-brand-black">
          Starting in 30 Minutes
        </Heading>

        <Text className="m-0 mb-6 text-4 leading-6 text-gray-600">
          Hi {recipientName}, your interview is about to begin.
        </Text>

        <Section className="mb-6 rounded-lg bg-gray-50 px-6 py-5">
          <Text className="m-0 mb-2 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Position:</strong> {jobTitle}
          </Text>
          <Text className="m-0 mb-2 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">{otherLabel}:</strong>{" "}
            {otherPartyName}
          </Text>
          <Text className="m-0 mb-2 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Time:</strong> {startsAt}
          </Text>
          <Text className="m-0 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Duration:</strong> {duration}{" "}
            minutes
          </Text>
        </Section>

        {meetLink && (
          <Section className="mb-6 text-center">
            <Button
              href={meetLink}
              className="rounded-lg bg-brand-green px-8 py-3 text-4 font-semibold text-brand-black"
            >
              Join Google Meet
            </Button>
            <Text className="m-0 mt-3 text-3 leading-4 text-gray-400">
              {meetLink}
            </Text>
          </Section>
        )}

        <Hr className="my-6 border-solid border-gray-200" />
        <Text className="m-0 text-3 leading-4 text-gray-400">
          &copy; {new Date().getFullYear()} HackHyre. All rights reserved.
        </Text>
      </Container>
    </EmailContainer>
  );
}

InterviewReminderEmail.PreviewProps = {
  recipientName: "Alex Johnson",
  otherPartyName: "Sarah Williams",
  jobTitle: "Senior Frontend Engineer",
  startsAt: "10:00 AM",
  duration: 45,
  meetLink: "https://meet.google.com/abc-defg-hij",
  role: "candidate",
} satisfies InterviewReminderEmailProps;

export { InterviewReminderEmail };
