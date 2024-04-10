import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Text,
} from "@react-email/components";

export const VerifyEmailTemplate = ({
    verificationUrl,
}: {
    verificationUrl: string;
}) => (
    <Html>
        <Head />
        <Preview>You are verifying your email.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Verify Email</Heading>
                <Link
                    href={verificationUrl}
                    target="_blank"
                    style={{
                        ...link,
                        display: "block",
                        marginBottom: "16px",
                    }}
                >
                    Click this link to verify your email
                </Link>
                <Text
                    style={{
                        ...text,
                        color: "#ababab",
                        marginTop: "14px",
                        marginBottom: "16px",
                    }}
                >
                    If you didn&apos;t initiate this, you can safely ignore this
                    email.
                </Text>
                <Img
                    src="https://zefer.blog/zefer.svg"
                    width="32"
                    height="32"
                    alt="ZeFer's Logo"
                />
                <Text style={footer}>
                    <Link
                        href="https://zefer.blog"
                        target="_blank"
                        style={{ ...link, color: "#898989" }}
                    >
                        ZeFer
                    </Link>
                    Tell your story to the world.
                    <br />
                    Bringing you diverse stories from around the world.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default VerifyEmailTemplate;

const main = {
    backgroundColor: "#ffffff",
};

const container = {
    paddingLeft: "12px",
    paddingRight: "12px",
    margin: "0 auto",
};

const h1 = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "40px 0",
    padding: "0",
};

const link = {
    color: "#2754C5",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    textDecoration: "underline",
};

const text = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    margin: "24px 0",
};

const footer = {
    color: "#898989",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "12px",
    lineHeight: "22px",
    marginTop: "12px",
    marginBottom: "24px",
};

// const code = {
//     display: "inline-block",
//     padding: "16px 4.5%",
//     width: "90.5%",
//     backgroundColor: "#f4f4f4",
//     borderRadius: "5px",
//     border: "1px solid #eee",
//     color: "#333",
// };
