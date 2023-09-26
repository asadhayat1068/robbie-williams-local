import prisma from "../lib/prisma";

async function main() {
  // const response = await Promise.all([
  //   // prisma.user.upsert({
  //   //   where: { email: "asad@caduceus.foundation" },
  //   //   update: {},
  //   //   create: {
  //   //     email: "asad@caduceus.foundation",
  //   //     orders: {
  //   //       create: [
  //   //         {
  //   //           orderId: "ord1",
  //   //           tickets: {
  //   //             create: [
  //   //               {
  //   //                 ticketId: "tic1",
  //   //                 email: "asad@caduceus.foundation",
  //   //               },
  //   //               {
  //   //                 ticketId: "tic2",
  //   //                 email: "asad+1@caduceus.foundation",
  //   //               },
  //   //             ],
  //   //           },
  //   //         },
  //   //         {
  //   //           orderId: "ord2",
  //   //           tickets: {
  //   //             create: [
  //   //               {
  //   //                 ticketId: "tic3",
  //   //                 email: "asad@caduceus.foundation",
  //   //               },
  //   //               {
  //   //                 ticketId: "tic4",
  //   //                 email: "asad+1@caduceus.foundation",
  //   //               },
  //   //             ],
  //   //           },
  //   //         },
  //   //       ],
  //   //     },
  //   //   },
  //   // }),
  //   // prisma.user.upsert({
  //   //   where: { email: "giulio@caduceus.foundation" },
  //   //   update: {},
  //   //   create: {
  //   //     email: "giulio@caduceus.foundation",
  //   //     orders: {
  //   //       create: [
  //   //         {
  //   //           orderId: "ord3",
  //   //           tickets: {
  //   //             create: [
  //   //               {
  //   //                 ticketId: "tic5",
  //   //                 email: "giulio@caduceus.foundation",
  //   //               },
  //   //               {
  //   //                 ticketId: "tic6",
  //   //                 email: "giulio+1@caduceus.foundation",
  //   //               },
  //   //               {
  //   //                 ticketId: "tic7",
  //   //                 email: "giulio+2@caduceus.foundation",
  //   //               },
  //   //             ],
  //   //           },
  //   //         },
  //   //       ],
  //   //     },
  //   //   },
  //   // }),
  //   // mark buys tickets for himself first
  //   // prisma.user.upsert({
  //   //   where: { email: "mark@caduceus.foundation" },
  //   //   update: {},
  //   //   create: {
  //   //     email: "mark@caduceus.foundation",
  //   //     orders: {
  //   //       create: [
  //   //         {
  //   //           orderId: "ord4",
  //   //           tickets: {
  //   //             create: [
  //   //               {
  //   //                 ticketId: "tic8",
  //   //                 email: "mark@caduceus.foundation",
  //   //               },
  //   //               {
  //   //                 ticketId: "tic9",
  //   //                 email: "mark@caduceus.foundation", // mark buys tickets for himself first
  //   //               },
  //   //               {
  //   //                 ticketId: "tic10",
  //   //                 email: "mark@caduceus.foundation", // mark buys tickets for himself first
  //   //               },
  //   //             ],
  //   //           },
  //   //         },
  //   //       ],
  //   //     },
  //   //   },
  //   // }),
  // ]);
  // console.log(response);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
