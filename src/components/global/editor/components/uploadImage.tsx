  "use client";

  import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
  import "@uploadcare/react-uploader/core.css";
  import React from "react";

  type UploadImageProps = {
    contentId: string;
    onContentChange: (
      contentID: string,
      newContent: string | string[] | string[][]
    ) => void;
  };

  const UploadImage = ({ contentId, onContentChange }: UploadImageProps) => {
    // const handleChangeEvent = (event: {
    //   status: "success";
    //   internalId: string;
    //   name: string;
    //   size: number;
    //   isImage: boolean;
    //   mimeType: string;
    //   metadata: Record<string, unknown> | null;
    //   file: File | Blob | null;
    //   externalUrl: string | null;
    //   uploadProgress: number;
    //   fullPath: string | null;
    //   source: string | null;
    // }) => {
    //   const cdnUrl = event.externalUrl || event.fullPath;
    //   console.log("NEW IMAGE URL:", cdnUrl);
    //   if (cdnUrl) {
    //     onContentChange(contentId, cdnUrl);
    //   }
    // };
//     const handleChangeEvent = (fileInfo: any) => {
//   console.log("FULL FILE OBJECT:", fileInfo);

//   // const cdnUrl = fileInfo?.cdnUrl;
//   const uuid = fileInfo?.uuid;

// const cdnUrl = uuid
//   ? `https://ucarecdn.com/${uuid}/`
//   : null;

//   console.log("CDN URL:", cdnUrl);

//   if (cdnUrl) {
//     onContentChange(contentId, cdnUrl);
  //}
//   const handleChangeEvent = (fileInfo: any) => {
//   console.log("UPLOAD OBJECT:", fileInfo);

//   const uuid = fileInfo?.uuid;

//   if (uuid) {
//     const cdnUrl = `https://ucarecdn.com/${uuid}/-/format/auto/-/quality/smart/`;
//     console.log("FINAL URL:", cdnUrl);
//     onContentChange(contentId, cdnUrl);
//   }
// };
    type UploadcareFile = {
  uuid: string;
  name: string;
};
const handleChangeEvent = (fileInfo: UploadcareFile) => {
  console.log("UPLOAD OBJECT:", fileInfo);

  const uuid = fileInfo?.uuid;

  if (uuid) {
    const cdnUrl = `https://1e3cdfbsmy.ucarecd.net/${uuid}/${fileInfo.name}`;
    console.log("FINAL WORKING URL:", cdnUrl);

    onContentChange(contentId, cdnUrl);
  }
};
    return (
      <div>
        <FileUploaderRegular
          sourceList="local, camera, facebook, gdrive"
          cameraModes="photo, video"
          pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
          multiple={false}
          onFileUploadSuccess={handleChangeEvent}
          maxLocalFileSizeBytes={10485760}
          
        />
      </div>
    );
  };

  export default UploadImage;
