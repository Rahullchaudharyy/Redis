import { type Request, type Response } from "express";
import { pdfQueue } from "../queue";


export const genPdfProvide = async (req: Request, res: Response): Promise<any> => {
    const { base, email } = req.body
    if (!base) {
        return res.status(400).json({ status: false, message: "Plese Enter collection base" });
    }
    if (!email) {
        return res.status(400).json({ status: false, message: "Plese Enter Your Email ID" });
    }
    const jobData = {
        type: "pdf",
        data: {
            email,
            base
        }
    }

    const job = await pdfQueue.add(jobData);
    return res.status(201).json({ status: true, message: "Your Pdf generate Request Send Successfully", job });
}