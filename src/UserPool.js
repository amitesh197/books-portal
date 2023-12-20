import { CognitoUserPool } from "amazon-cognito-identity-js";
const poolData = {
  UserPoolId: "ap-south-1_HiJPiffM7",
  ClientId: "6db3r7ki8e23eiin42124vr9v1",
};

export default new CognitoUserPool(poolData);
