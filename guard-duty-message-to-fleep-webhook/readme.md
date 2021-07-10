1. Build the lambda source code with `npm run build`.
2. Deploy the lambda source code with `npm run deploy`.
3. Go to the aws cloud formation stack.
4. Change desired options for the stack.
5. Subscribe for new events on a [desired arn](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_sns.html) with the deployed lambda.

# List of executed deployments
```bash
AWS_PROFILE=production AWS_REGION=us-east-1 NODE_ENV=production npm run deploy
AWS_PROFILE=production AWS_REGION=us-west-2 NODE_ENV=production npm run deploy
```
