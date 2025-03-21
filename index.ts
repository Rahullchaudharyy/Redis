import express from "express";
import { genPdfProvide } from "./providers/pdfProvider";
import { startPdfWorker } from "./workers/pdfWorker";
import { genExcelProvide } from "./providers/excelProvider";
import { startExcelWorker } from "./workers/excelWorker";
import cors from "cors";
const app = express();
app.use(express.json(), cors());
app.use(express.static("public"))
const port: number = 3323;
const ACCESS_KEY = "1236789"


const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction): any => {
    const apiKey = req.headers['access-key'] as string;
    if (apiKey && apiKey === ACCESS_KEY) {
        next();
    } else {
        return res.status(403).json({
            status: false,
            message: "Forbidden: Invalid or missing access key"
        });
    }
}
        
// Apply authentication middleware globally
app.use(authenticate);

app.post("/gen/pdf", genPdfProvide)
app.post("/gen/excel", genExcelProvide)



app.listen(port, () => {
    console.log("G2G Process Start on Port - " + port);
    startPdfWorker();
    startExcelWorker();
});