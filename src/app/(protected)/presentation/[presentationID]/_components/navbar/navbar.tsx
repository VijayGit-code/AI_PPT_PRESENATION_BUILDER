// "use client";

// import { Button } from "@/components/ui/button";
// import { useSlideStore } from "@/store/useSlideStore";
// import { Forward, Home, Play } from "lucide-react";
// import Link from "next/link";
// import React, { useState } from "react";
// import { toast } from "sonner";
// import PresentationMode from "./presentationMode";

// type NavbarProps = {
//   presentationID: string;
// };
  
// const Navbar = ({ presentationID }: NavbarProps) => {
//   const [isPresentationMode, setIsPresentationMode] = useState(false);
//   const { currentTheme, project } = useSlideStore();
//   // const [isSellable, setIsSellable] = useState(project?.isSellable || false)

//   const handleCopy = () => {
//     navigator.clipboard.writeText(
//       `${window.location.origin}/share/${presentationID}`
//     );

//     toast.success("Link Copied", {
//       description: "Link copied to clipboard",
//     });
//   };

//   // const toggleSellableButton = () => {
//   //     setIsSellable(!isSellable)
//   // }

//   // useEffect(() => {
//   //     const handler = setTimeout(async () => {
//   //         if (isSellable !== project?.isSellable) {
//   //             await toggleSellable(presentationID, isSellable)
//   //             router.refresh()
//   //         }
//   //     }, 3000)

//   //     return () => {
//   //         clearTimeout(handler)
//   //     }
//   // }, [isSellable])

//   return (
//     <nav
//       className="boarder-b fixed top-0 right-0 left-0 z-50 flex h-20 w-full items-center justify-between px-7 py-4"
//       style={{
//         backgroundColor:
//           currentTheme.navbarColor || currentTheme.backgroundColor,
//         color: currentTheme.accentColor,
//       }}
//     >
//       <Link href={`/dashboard`} passHref>
//         <Button
//           variant={"outline"}
//           className="flex cursor-pointer items-center gap-2"
//           style={{
//             backgroundColor: currentTheme.backgroundColor,
//           }}
//         >
//           <Home className="size-4" />
//           <span className="hidden sm:inline">Return Home</span>
//         </Button>
//       </Link>

//       <Link
//         href={`/presentation/template-market`}
//         className="hidden text-lg font-semibold sm:block"
//       >
//         {project?.title}
//       </Link>

//       <div className="flex items-center gap-4">
//         {/*<Button
//                     className="bg-white border w-16 h-8 rounded-3xl cursor-pointer hover:bg-gray-200 p-2 relative"
//                     onClick={toggleSellableButton}
//                     title="Sellable"
//                 >
//                     <div
//                         className={cn(
//                             "h-6 aspect-square bg-blue-600 rounded-full absolute transition-transform duration-300",
//                             isSellable ? "translate-x-4" : "-translate-x-4"
//                         )}
//                     />
//                 </Button>*/}

//         <Button
//           style={{ backgroundColor: currentTheme.backgroundColor }}
//           variant={"outline"}
//           className="cursor-pointer"
//           onClick={handleCopy}
//         >
//           <Forward className="size-4" />
//         </Button>
//         {/* <SellTemplate/> */}
//         <Button
//           variant={"default"}
//           className="flex cursor-pointer items-center justify-center gap-2"
//           onClick={() => setIsPresentationMode(true)}
//         >
//           <Play className="size-4" fill="black" />

//           <span className="hidden sm:inline">Present</span>
//         </Button>
//       </div>

//       {isPresentationMode && (
//         <PresentationMode onClose={() => setIsPresentationMode(false)} />
//       )}
//     </nav>
//   );
// };

// export default Navbar;
"use client";

import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/store/useSlideStore";
import { Download, Home, Play } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import PresentationMode from "./presentationMode";

type NavbarProps = {
  presentationID: string;
};

const Navbar = ({ presentationID }: NavbarProps) => {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const { currentTheme, project } = useSlideStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 const { slides } = useSlideStore();

const handleDownload = async (type: "ppt" | "pdf" | "doc") => {
  try {
    toast.loading("Preparing download...");

    const response = await fetch(
      `/api/download/${presentationID}?type=${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slides: slides || [],   // 🔥 THIS IS THE FIX
          theme: currentTheme || {},
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${project?.title || "presentation"}.${
      type === "ppt" ? "pptx" : type === "pdf" ? "pdf" : "docx"
    }`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    toast.success("Download started");
  } catch (error) {
    console.error(error);
    toast.error("Download failed");
  }
};


return (
    <nav
      className="border-b fixed top-0 right-0 left-0 z-50 flex h-20 w-full items-center justify-between px-7 py-4"
      
      style={{
        backgroundColor:
          currentTheme.navbarColor || currentTheme.backgroundColor,
        color: currentTheme.accentColor,
      }}
    >
      {/* Return Home */}
      <Link href={`/dashboard`} passHref>
        <Button
          variant="outline"
          className="flex cursor-pointer items-center gap-2"
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
        >
          <Home className="size-4" />
          <span className="hidden sm:inline">Return Home</span>
        </Button>
      </Link>

      {/* Project Title */}
      <Link
        href={`/presentation/template-market`}
        className="hidden text-lg font-semibold sm:block"
      >
        {project?.title}
      </Link>

      <div className="flex items-center gap-4">
        {/* DOWNLOAD BUTTON */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            style={{ backgroundColor: currentTheme.backgroundColor }}
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>

          {isDownloadOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow-xl">
              <button
                onClick={() => handleDownload("ppt")}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Download PPT
              </button>
              <button
                onClick={() => handleDownload("pdf")}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Download PDF
              </button>
              <button
                onClick={() => handleDownload("doc")}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Download DOC
              </button>
            </div>
          )}
        </div>

        {/* PRESENT BUTTON */}
        <Button
          variant="default"
          className="flex cursor-pointer items-center justify-center gap-2"
          onClick={() => setIsPresentationMode(true)}
        >
          <Play className="size-4" fill="black" />
          <span className="hidden sm:inline">Present</span>
        </Button>
      </div>

      {isPresentationMode && (
        <PresentationMode onClose={() => setIsPresentationMode(false)} />
      )}
    </nav>
  );
};

export default Navbar;