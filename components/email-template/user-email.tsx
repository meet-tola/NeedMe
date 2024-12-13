import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface UserEmailProps {
  userName: string;
  businessName: string;
  formTitle: string;
  status: "Scheduled" | "Cancelled";
  additionalMessage?: string;
}

export const UserEmail = ({
  userName,
  businessName,
  formTitle,
  status,
  additionalMessage,
}: UserEmailProps) => {
  const isScheduled = status === "Scheduled";

  return (
    <Html>
      <Head />
      <Preview>Your Appointment Has Been {status}</Preview>
      <Body style={main}>
        <Container>
          <Section style={logo}>
            <Img
              src="https://res.cloudinary.com/dvvirefzi/image/upload/v1734116838/talktrack3_sqv4bc.png"
              style={{
                width: "150px",
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
              alt="Company Logo"
            />
          </Section>

          <Section style={content}>
            <Row>
              <Column>
                <Heading style={heading}>Hello {userName},</Heading>
                <Text style={paragraph}>
                  Your appointment with <b>{businessName}</b> has been{" "}
                  <b>{status}</b>.
                </Text>
                <Text style={paragraph}>
                  <b>Form Title:</b> {formTitle}
                </Text>
                {additionalMessage && (
                  <Text style={paragraph}>
                    <b>
                      {isScheduled ? "Additional Message:" : "Reason for Cancellation:"}
                    </b>{" "}
                    {additionalMessage}
                  </Text>
                )}
                {isScheduled && (
                  <Text style={paragraph}>
                    We’re excited to meet with you! Please wait to receive
                    furtherd etails of your appointment.
                  </Text>
                )}
                {!isScheduled && (
                  <Text style={paragraph}>
                    We're sorry that your appointment was canceled. Please reach
                    out to <b>{businessName}</b> if you have any questions.
                  </Text>
                )}
              </Column>
            </Row>
          </Section>

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgb(0,0,0, 0.7)",
              marginTop: 20,
            }}
          >
            © 2024 | Talktrack, 123, Lagos Street | www.talktrack.vercel.app
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

UserEmail.PreviewProps = {
  userName: "John Doe",
  businessName: "Acme Corp",
  formTitle: "Consultation Request",
  status: "Scheduled",
  formId: 123,
} as UserEmailProps;

export default UserEmail;

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const logo = {
  padding: "30px 20px",
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: 3,
  padding: "20px",
  overflow: "hidden",
};

const heading = {
  fontSize: 26,
  fontWeight: "bold",
  marginBottom: 20,
};

const paragraph = {
  fontSize: 16,
  marginBottom: 10,
};
