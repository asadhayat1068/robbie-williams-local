import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { TICKET_NFT_CONTRACT_ABI } from "./contract/contract_abi";
const { JSONRPC_URL, SIGNER_PRIVATE_KEY, TICKET_NFT_CONTRACT_ADDRESS } = process.env;
const provider = new JsonRpcProvider(JSONRPC_URL);
const signer = new Wallet(SIGNER_PRIVATE_KEY || "", provider);

const TICKET_CONTRACT = new Contract(
    TICKET_NFT_CONTRACT_ADDRESS || '',
    TICKET_NFT_CONTRACT_ABI,
    signer
);

export const mintTicket =async (to: string) => {
    const tx = await TICKET_CONTRACT.safeMint(to);
    await tx.wait();
    return tx.hash;
}