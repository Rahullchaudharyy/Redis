import { pdfQueue } from "../queue";
import { genAcademicRequestsPDF } from "./services/pdf/genAcademicRequestsPDF";
import { genAccStanderdsPdf } from "./services/pdf/genAccStanderdsPdf";
import { genAreaTypePdf } from "./services/pdf/genAreaTypePdf";
import { genFSLPPdf } from "./services/pdf/genFSLPPdf";
import { genMeasurementsPdf } from "./services/pdf/genMeasurementstsPdf";
import { genMembershipPDF } from "./services/pdf/genMembershipPDF";
import { genProjectTypePdf } from "./services/pdf/genProjectTypePdf";
import { genSdgListPdf } from "./services/pdf/genSdgsListPdf";
import { genPdfTreeOrders } from "./services/pdf/genTreePlantingOrderPdf";
import { genPdfTrees } from "./services/pdf/genTreesPdf";
import { genUnitTypePdf } from "./services/pdf/genUnitTypePdf";
import { genBlogCategoryPdf } from "./services/pdf/getBlogCategoryPdf";
import { getOtherOrdersPdf } from "./services/pdf/getOtherOrdersPdf";

export const startPdfWorker = () => {
  pdfQueue.process(async (job) => {
    const { base, email } = job.data.data;
    switch (base) {
      case "project_type":
        await genProjectTypePdf(email);
        break;
      case "sdg_list":
        await genSdgListPdf(email);
        break;
      case "unit_types":
        await genUnitTypePdf(email);
        break;
      case "measurements":
        await genMeasurementsPdf(email);
        break;
      case "area_type":
        await genAreaTypePdf(email);
        break;
      case "blog_category":
        await genBlogCategoryPdf(email);
        break;
      case "accredation_standars":
        await genAccStanderdsPdf(email);
        break;
      case "trees":
        await genPdfTrees(email);
        break;
      case "tree_planting_orders":
        await genPdfTreeOrders(email);
        break;
      case "other_projects_orders":
        await getOtherOrdersPdf(email);
        break;
      case "membership_payments":
        await genMembershipPDF(email);
        break;
      case "academics_requests":
        await genAcademicRequestsPDF(email);
        break;
      case "fslp":
        await genFSLPPdf(email);
        break;
      case "reward_payout":
      // await
      // break;

      default:
        console.log("Unknown data - " + base);
        break;
    }
  });
};
