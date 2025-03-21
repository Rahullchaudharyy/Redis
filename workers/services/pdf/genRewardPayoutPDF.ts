import fs from "fs";
import PDFDocumentWithTables from "pdfkit-table";
import { loadPaginatedData } from "../../../request/actions";

import { mailSender } from "../../mail/mailSender";
import { getRewardPayout } from "../../../request/fetch/getRewardPayout";
import type { RewardPayoutType } from "../../../interface/rewardPayout";

export const genRewardPayoutpdf = async (email: string) => {
  const doc = new PDFDocumentWithTables({ margin: 30 });
  const outputPath = "public/reward_payout.pdf";
  doc.pipe(fs.createWriteStream(outputPath)); // Output PDF to file

  try {
    console.log("Loading Reward Payout...");
    const requests: RewardPayoutType[] = await loadPaginatedData(
      getRewardPayout
    );

    if (!requests || requests.length === 0) {
      console.log("No Reward Payout  available.");
      doc
        .fontSize(14)
        .text("No Reward Payout  available.", { align: "center" });
    } else {
      // Set Image Path and Dimensions
      const imagePath = "public/main-logo.png";
      const imageWidth = 100; // Width of the image
      const imageHeight = 35; // Height of the image

      // Calculate X Position to Center the Image
      const xPos = (doc.page.width - imageWidth) / 2;

      // Add Image at Centered Position
      doc.image(imagePath, xPos, 50, {
        // 50 is the Y position for top margin
        width: imageWidth,
        height: imageHeight,
      });

      // Move Down for the Title
      doc.moveDown(6);
      doc.fontSize(20).text("Reward Payout Report", { align: "center" });
      doc.moveDown(2); // Space below the title

      // Prepare table data
      // Prepare table data
      const table = {
        headers: [
          "Payout ID",
          "Amount",
          "Bank Name",
          "Account Number",
          "Bank Holder",
          "Email",
          "Mobile",
          "Status",
          "Released By",
          "Created At",
          "Updated At",
        ],
        rows: requests.map((item: RewardPayoutType) => {
          const Item = item.items;
          Item.map((item) => [
            item.id,
            `$${item.amount}`, // Formatting amount as currency
            item.bankAccountName || "N/A",
            item.bankAccountNumber || "N/A",
            item.bankHolderName || "N/A",
            item.emailID || "N/A",
            item.mobileNo || "N/A",
            item.status || "N/A",
            item.releaseBy || "N/A", // Assuming this is a user ID; expand if needed
            item.created || "N/A",
            item.updated || "N/A",
          ]);
        }),
      };

      // Add table to PDF
      doc.table(table as any, {
        padding: [4],
        columnSpacing: 10,
        minRowHeight: 5,
      });

      doc.end(); // Finalize the PDF document
      console.log("PDF file for Reward Payout  generated successfully.");

      // Send the PDF file via email
      await mailSender("Reward Payout  List PDF Report", email, [
        "reward_payout.pdf",
      ]);
    }
  } catch (error) {
    console.error("Error generating Reward Payout  PDF:", error);
    doc.fontSize(14).text("An error occurred while loading Reward Payout.", {
      align: "center",
    });
    doc.end(); // Finalize PDF even in case of error
  }
};
