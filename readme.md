## Deploy lambda to the aws cloud
```bash
AWS_PROFILE=production AWS_REGION=us-west-2 NODE_ENV=production npm run deploy
```

## Override desired stack and lambda names on deploy
You can set `NAME` variable to change target stack and lambda names. Set the variable on deploy command within lambdas.
```bash
NAME=foo npm run deploy 
```
