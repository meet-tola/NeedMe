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

interface AppointmentEmailProps {
  businessName: string;
  userName: string;
  formTitle: string;
  submissionContent: string;
  formId: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const AppointmentEmail = ({
  businessName,
  userName,
  formTitle,
  submissionContent,
  formId,
}: AppointmentEmailProps) => {
  const appointmentUrl = `${baseUrl}/appointment/${formId}`;

  return (
    <Html>
      <Head />
      <Preview>New Appointment Submission</Preview>
      <Body style={main}>
        <Container>
          <Section style={logo}>
            <Img src={`${baseUrl}/static/company-logo.png`} alt="Company Logo" />
          </Section>

          <Section style={content}>
            <Row>
              <Column>
                <Heading style={heading}>
                  Hello {businessName},
                </Heading>
                <Text style={paragraph}>
                  You have received a new appointment submission from <b>{userName}</b>.
                </Text>
                <Text style={paragraph}>
                  <b>Form Title:</b> {formTitle}
                </Text>
                <Text style={paragraph}>
                  <b>Submission Content:</b>
                </Text>
                <Text style={submissionContentStyle}>
                  {submissionContent}
                </Text>
                <Text style={paragraph}>
                  Click the button below to view the appointment details:
                </Text>
                <Row style={containerButton}>
                  <Button style={button} href={appointmentUrl}>
                    View Appointment
                  </Button>
                </Row>
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
            © 2024 | Your Company Name, Your Company Address | www.yourwebsite.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

AppointmentEmail.PreviewProps = {
  businessName: "Business Owner",
  userName: "John Doe",
  formTitle: "Consultation Request",
  submissionContent: "Looking forward to discussing the project in detail.",
  formId: 123,
} as AppointmentEmailProps;

export default AppointmentEmail;

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

const submissionContentStyle = {
  fontSize: 16,
  backgroundColor: "#f9f9f9",
  padding: "10px",
  borderRadius: 3,
  border: "1px solid rgb(0,0,0, 0.1)",
};

const containerButton = {
  display: "flex",
  justifyContent: "center",
  marginTop: 20,
};

const button = {
  backgroundColor: "#007BFF",
  borderRadius: 3,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  cursor: "pointer",
  padding: "12px 30px",
  textDecoration: "none",
};
