export type Ticket = {
  ticketId: string;
  email: string;
  orderId: string;
  nftStatus?: string;
};

export const mintingStatus = {
  MINTING: "minting",
  MINTED: "minted",
  FAILED: "failed",
  UNCLAIMED: "unclaimed",
};
