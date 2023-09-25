import { computeAddress } from "ethers";
import * as jose from "jose";

export const verifyJWT = async (jwtToken: string) => {
  try {
    const idToken = jwtToken.split(" ")[1];

    const jwks = jose.createRemoteJWKSet(
      new URL("https://api-auth.web3auth.io/jwks")
    );
    const jwtDecoded = await jose.jwtVerify(idToken, jwks, {
      algorithms: ["ES256"],
    });
    const wallets = (jwtDecoded.payload as any).wallets.map((wallet: any) => ({
      ...wallet,
      address: computeAddress("0x" + wallet.public_key),
    }));
    const {
      email,
      name,
      profileImage,
      verifier,
      verifierId,
      aggregateVerifier,
    } = jwtDecoded.payload as any;
    return {
      success: true,
      data: {
        email,
        name,
        profileImage,
        verifier,
        verifierId,
        aggregateVerifier,
        wallets,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};
