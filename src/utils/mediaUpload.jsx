import { createClient } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";

const supabase = createClient(
  "https://howhygpegujbbfzexagh.supabase.co",

  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd2h5Z3BlZ3VqYmJmemV4YWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjM3OTAsImV4cCI6MjA2MDAzOTc5MH0.BTpJcykEkYRkKOMo1GFtvtVHrCSwhR97jUVN3TBojdM"
);
export default function MediaUpload(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      reject("No file selected");
    }
    const timeStamp = new Date().getTime();
    const newFileName = timeStamp + file.name;

    supabase.storage
      .from("images")
      .upload(newFileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then(() => {
        toast.success("File uploaded successfully");
        const url = supabase.storage.from("images").getPublicUrl(newFileName)
          .data.publicUrl;
        resolve(url);
      })
      .catch(() => {
        toast.error("File not uploaded");
        reject("File upload failed");
      });
  });
}
