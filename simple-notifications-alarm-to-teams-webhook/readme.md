1. Build the lambda source code with `npm run build`.
2. Deploy the lambda source code with `npm run deploy`.
3. Go to the aws cloud formation stack.
4. Change desired options for the stack.
5. Subscribe for new events on a desired arn with the deployed lambda.

# List of executed deployments
```bash
AWS_PROFILE=production AWS_REGION=us-east-1 NAME=simple-notifications-alarm-to-teams-webhook NODE_ENV=production npm run deploy
AWS_PROFILE=production AWS_REGION=us-west-2 NAME=simple-notifications-alarm-to-teams-webhook NODE_ENV=production npm run deploy
```

# Simple notifications alarm to teams webhook
This stack is used to subscribe for [AWS CloudWatch](https://console.aws.amazon.com/cloudwatch/home) alarms via [AWS SNS](https://console.aws.amazon.com/sns/home) topics.
Every notification will be published to [Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software) channel via [Teams Webhook](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) integration.
Message template is fully customizable.

**Supported message template variables**

You can customize message content format which will be published to a channel.
The default message template has everything needed and human-readable format.

```bash
${marker} *${title}* now is in `${state}` state. You can get more details about the alarm in [aws cloud watch console](${url}).
```

![Default template example](docs/example.png)

|Code|Usage|Description|
|----|-----|-----------|
|`arn`|`${arn}`|Internal notification amazon resource name.|
|`state`|`${state}`|Alarm state: `insufficient`, `alarm` or `ok`.|
|`marker`|`${marker}`|Alarm marker based on alarm state: `⚠`, `🔥` or `✅`.|
|`title`|`${title}`|Alarm name from cloud watch console.|
|`description`|`${description}`|Alarm description from cloud watch console.|
|`url`|`${url}`|Alarm url to cloud watch console with particular alarm.|
