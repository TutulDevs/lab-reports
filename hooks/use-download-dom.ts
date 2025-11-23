import { dateFormatter } from "@/lib/utils";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { toast } from "sonner";

export const useDownloadDOM = (
  fileName = `image-${dateFormatter(new Date(), "yyyy-MM-dd-hh-mm-ss")}`,
) => {
  const { resolvedTheme } = useTheme();

  const ref = useRef<any>(null);

  const downloadImage = async () => {
    if (!ref.current) {
      toast.error("Failed to download");
      return;
    }

    try {
      toJpeg(ref.current, {
        quality: 1,
        backgroundColor: resolvedTheme == "dark" ? "#000" : "#fff",
      }).then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = fileName + ".jpeg";
        link.href = dataUrl;
        link.click();
      });
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to download");
    }
  };

  return { ref, downloadImage };
};
