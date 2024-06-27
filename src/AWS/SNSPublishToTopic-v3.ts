import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
  SubscribeCommand,
  SubscribeCommandOutput,
} from "@aws-sdk/client-sns";

const snsClient: SNSClient = new SNSClient({
  region: "us-east-2",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "us-east-2" }),
    identityPoolId: "us-east-2:be5b2b71-b894-4434-8a30-ac5bcc129622",
  }),
});

// console.log(snsClient);

export async function PublishToTopic(
  params: PublishCommandInput
): Promise<PublishCommandOutput | undefined> {
  try {
    const data: PublishCommandOutput = await snsClient.send(
      new PublishCommand(params)
    );
    console.log("Success", data);
    return data;
  } catch (error) {
    console.log("error", error);
    throw new Error("" + error);
  }
}

export async function subscribeEmail(emailAddress: string): Promise<void> {
  try {
    const response: SubscribeCommandOutput = await snsClient.send(
      new SubscribeCommand({
        Protocol: "email",
        TopicArn: "arn:aws:sns:us-east-2:237600839617:clock-project",
        Endpoint: emailAddress,
      })
    );
    console.log("emailAddress", emailAddress);
    console.log(response);
  } catch (e) {
    throw new Error("" + e);
  }
}