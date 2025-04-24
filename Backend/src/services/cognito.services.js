import * as client from "openid-client";

let configInstance = null;
let generatorsInstance = null;

export const initializeCognitoOIDCClient = async () => {
  try {

    const server = new URL(process.env.COGNITO_SERVER);
    configInstance = await client.discovery(
        server,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
    );

    console.log(configInstance);

    generatorsInstance = {
      state: () => client.randomState(),
      nonce: () => client.randomNonce(),
      codeVerifier: () => client.randomPKCECodeVerifier(),
      codeChallenge: async (verifier) => await client.calculatePKCECodeChallenge(verifier),
    };

    console.log("✅ Cliente Cognito inicializado correctamente.");
  } catch (error) {
    console.error("❌ Error al inicializar Cognito:", error);
    throw error;
  }
};

export const getCognitoClient = () => {
  if (!configInstance) throw new Error("❌ Cognito client no ha sido inicializado.");
  return configInstance;
};

export const getGenerators = () => {
  if (!generatorsInstance) throw new Error("❌ Generators no han sido inicializados.");
  return generatorsInstance;
};
