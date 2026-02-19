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

interface InterviewScheduledRecruiterEmailProps {
  recruiterName: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  scheduledAt: string;
  duration: number;
  meetLink: string | null;
  interviewType: string;
}

export default function InterviewScheduledRecruiterEmail({
  recruiterName,
  candidateName,
  candidateEmail,
  jobTitle,
  scheduledAt,
  duration,
  meetLink,
  interviewType,
}: InterviewScheduledRecruiterEmailProps) {
  return (
    <EmailContainer
      preview={
        <Preview>
          Interview with {candidateName} for {jobTitle} has been booked
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
          Interview Booked
        </Heading>

        <Text className="m-0 mb-6 text-4 leading-6 text-gray-600">
          Hi {recruiterName}, an interview has been scheduled with the following
          candidate:
        </Text>

        <Section className="mb-6 rounded-lg bg-gray-50 px-6 py-5">
          <Text className="m-0 mb-2 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Candidate:</strong>{" "}
            {candidateName}
          </Text>
          <Text className="m-0 mb-2 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Email:</strong>{" "}
            {candidateEmail}
          </Text>
          <Text className="m-0 mb-2 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Position:</strong> {jobTitle}
          </Text>
          <Text className="m-0 mb-2 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Date & Time:</strong>{" "}
            {scheduledAt}
          </Text>
          <Text className="m-0 mb-2 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Duration:</strong> {duration}{" "}
            minutes
          </Text>
          <Text className="m-0 text-3.5 leading-5 text-gray-500">
            <strong className="text-brand-black">Type:</strong> {interviewType}
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
        <Text className="m-0 mt-1 text-3 leading-4 text-gray-400">
          You're receiving this because you scheduled an interview on HackHyre.
        </Text>
      </Container>
    </EmailContainer>
  );
}

InterviewScheduledRecruiterEmail.PreviewProps = {
  recruiterName: "Sarah Williams",
  candidateName: "Alex Johnson",
  candidateEmail: "alex@example.com",
  jobTitle: "Senior Frontend Engineer",
  scheduledAt: "Wednesday, Feb 19, 2026 at 10:00 AM",
  duration: 45,
  meetLink: "https://meet.google.com/abc-defg-hij",
  interviewType: "Technical",
} satisfies InterviewScheduledRecruiterEmailProps;

export { InterviewScheduledRecruiterEmail };
