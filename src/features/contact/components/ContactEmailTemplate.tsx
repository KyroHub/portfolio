import * as React from "react";
import { Html, Head, Body, Container, Text, Heading, Hr } from "@react-email/components";

type ContactEmailTemplateProps = {
  name: string;
  email: string;
  inquiryLabel: string;
  message: string;
};

export function ContactEmailTemplate({
  name,
  email,
  inquiryLabel,
  message,
}: ContactEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading as="h2" style={heading}>
            New Contact: {inquiryLabel}
          </Heading>
          <Text style={paragraph}>
            <strong>From:</strong> {name}
          </Text>
          <Text style={paragraph}>
            <strong>Email:</strong> {email}
          </Text>
          <Hr style={hr} />
          <Text style={{ ...paragraph, whiteSpace: "pre-wrap" }}>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};
