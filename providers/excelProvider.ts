import { type Request, type Response } from "express";
import { excelQueue, pdfQueue } from "../queue";


export const genExcelProvide = async (req: Request, res: Response): Promise<any> => {
    const { base, email } = req.body
    if (!base) {
        return res.status(400).json({ status: false, message: "Plese Enter collection base" });
    }
    if (!email) {
        return res.status(400).json({ status: false, message: "Plese Enter Your Emaiol ID" });
    }
    const jobData = {
        type: "excel",
        data: {
            email,
            base
        }
    }

    const job = await excelQueue.add(jobData);
    return res.status(201).json({ status: true, message: "Your excel generate Request Send Successfully", job });
}