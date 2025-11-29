import { dateFormatter } from "@/lib/utils";
import { useState } from "react";
import * as XLSX from "xlsx";

export const useExport = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExport = async (
    list: any[],
    headers?: string[],
    fileName?: string,
  ) => {
    fileName = fileName || `data-${dateFormatter(Date.now(), "yyyy-MM-dd")}`;

    // convert list to worksheet
    const worksheet = XLSX.utils.json_to_sheet(list, { header: headers });

    // create new workbook & append to worksheet
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // write the workbook & trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return { handleExport, isDownloading, setIsDownloading };
};
