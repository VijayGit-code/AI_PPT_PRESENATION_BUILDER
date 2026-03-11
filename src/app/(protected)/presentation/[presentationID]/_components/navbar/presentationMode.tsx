// "use client";

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSlideStore } from "@/store/useSlideStore";
// import MasterRecursiveComponent from "../editor/masterRecursiveComponent";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight, X } from "lucide-react";

// type PresentationModeProps = {
//   onClose: () => void;
// };

// const PresentationMode = ({ onClose }: PresentationModeProps) => {
//   const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
//   const { currentTheme, getOrderedSlides } = useSlideStore();

//   const slides = getOrderedSlides();

//   const goToPreviousSlide = () => {
//     setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };

//   const goToNextSlide = () => {
//     if (currentSlideIndex === slides.length - 1) {
//       onClose();
//     } else {
//       setCurrentSlideIndex((prevIndex) =>
//         Math.min(prevIndex + 1, slides.length - 1)
//       );
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "ArrowLeft") {
//         setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//       } else if (event.key === "ArrowRight" || event.key === " ") {
//         if (currentSlideIndex === slides.length - 1) {
//           onClose();
//         } else {
//           setCurrentSlideIndex((prevIndex) =>
//             Math.min(prevIndex + 1, slides.length - 1)
//           );
//         }
//       } else if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [slides.length, currentSlideIndex, setCurrentSlideIndex, onClose]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
//       <div
//         className="relative size-full"
//         style={{
//           aspectRatio: "16/9",
//           maxHeight: "100vh",
//           maxWidth: "100vw",
//         }}
//       >
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentSlideIndex}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 1.2 }}
//             transition={{ duration: 0.5 }}
//             className={`pointer-events-none size-full ${slides[currentSlideIndex].className}`}
//             style={{
//               backgroundImage: currentTheme.gradientBackground,
//               backgroundColor: currentTheme.slideBackgroundColor,
//               color: currentTheme.accentColor,
//               fontFamily: currentTheme.fontFamily,
//             }}
//           >
//             <MasterRecursiveComponent
//               content={slides[currentSlideIndex].content}
//               onContentChange={() => {}}
//               slideId={slides[currentSlideIndex].id}
//               isPreview={false}
//               isEditable={false}
//               index={currentSlideIndex}
//             />
//           </motion.div>
//         </AnimatePresence>

//         <Button
//           variant={"outline"}
//           size={"icon"}
//           className="absolute top-4 right-4 cursor-pointer"
//           onClick={onClose}
//         >
//           <X className="size-4" />
//         </Button>

//         <div className="absolute top-1/2 left-6 flex -translate-x-1/2 transform space-x-4">
//           <Button
//             variant="outline"
//             size="icon"
//             className="cursor-pointer disabled:cursor-not-allowed"
//             onClick={goToPreviousSlide}
//             disabled={currentSlideIndex === 0}
//           >
//             <ChevronLeft className="size-4" />
//           </Button>
//         </div>

//         <div className="absolute top-1/2 -right-2 flex -translate-x-1/2 transform space-x-4">
//           <Button
//             variant="outline"
//             size="icon"
//             className="cursor-pointer disabled:cursor-not-allowed"
//             onClick={goToNextSlide}
//             disabled={currentSlideIndex === slides.length - 1}
//           >
//             <ChevronRight className="size-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PresentationMode;


// "use client";

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSlideStore } from "@/store/useSlideStore";
// import MasterRecursiveComponent from "../editor/masterRecursiveComponent";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight, X } from "lucide-react";

// type PresentationModeProps = {
//   onClose: () => void;
// };

// const PresentationMode = ({ onClose }: PresentationModeProps) => {
//   const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
//   const { currentTheme, getOrderedSlides } = useSlideStore();

//   const slides = getOrderedSlides();

//   const goToPreviousSlide = () => {
//     setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };

//   const goToNextSlide = () => {
//     if (currentSlideIndex === slides.length - 1) {
//       onClose();
//     } else {
//       setCurrentSlideIndex((prevIndex) =>
//         Math.min(prevIndex + 1, slides.length - 1)
//       );
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "ArrowLeft") {
//         goToPreviousSlide();
//       } else if (event.key === "ArrowRight" || event.key === " ") {
//         goToNextSlide();
//       } else if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [currentSlideIndex, slides.length]);

//   return (
//     <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
//       {/* 16:9 Slide Wrapper */}
//       <div className="relative w-full h-full flex items-center justify-center">
//         <div
//           className="relative w-full max-w-[95vw] max-h-[95vh] aspect-video shadow-2xl rounded-xl overflow-hidden"
//           style={{
//             backgroundImage: currentTheme.gradientBackground,
//             backgroundColor: currentTheme.slideBackgroundColor,
//           }}
//         >
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentSlideIndex}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.4 }}
//               className="w-full h-full flex px-16 py-12"
//               style={{
//                 color: currentTheme.accentColor,
//                 fontFamily: currentTheme.fontFamily,
//               }}
//             >
//               <MasterRecursiveComponent
//                 content={slides[currentSlideIndex].content}
//                 onContentChange={() => {}}
//                 slideId={slides[currentSlideIndex].id}
//                 isPreview={false}
//                 isEditable={false}
//                 index={currentSlideIndex}
//               />
//             </motion.div>
//           </AnimatePresence>

//           {/* Close Button */}
//           <Button
//             variant="outline"
//             size="icon"
//             className="absolute top-4 right-4 z-20"
//             onClick={onClose}
//           >
//             <X className="size-4" />
//           </Button>

//           {/* Left Arrow */}
//           <Button
//             variant="outline"
//             size="icon"
//             className="absolute top-1/2 left-6 -translate-y-1/2 z-20"
//             onClick={goToPreviousSlide}
//             disabled={currentSlideIndex === 0}
//           >
//             <ChevronLeft className="size-4" />
//           </Button>

//           {/* Right Arrow */}
//           <Button
//             variant="outline"
//             size="icon"
//             className="absolute top-1/2 right-6 -translate-y-1/2 z-20"
//             onClick={goToNextSlide}
//             disabled={currentSlideIndex === slides.length - 1}
//           >
//             <ChevronRight className="size-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PresentationMode;
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSlideStore } from "@/store/useSlideStore";
import MasterRecursiveComponent from "../editor/masterRecursiveComponent";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type PresentationModeProps = {
  onClose: () => void;
};

const PresentationMode = ({ onClose }: PresentationModeProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const { currentTheme, getOrderedSlides } = useSlideStore();

  const slides = getOrderedSlides();
  const currentSlide = slides[currentSlideIndex];

  // Detect if slide has images
  const slideContent = Array.isArray(currentSlide.content)
    ? currentSlide.content
    : [currentSlide.content];

  const imageItems = slideContent.filter((item: any) => item.type === "image");
  const onlyText = imageItems.length === 0;

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNextSlide = () => {
    if (currentSlideIndex === slides.length - 1) {
      onClose();
    } else {
      setCurrentSlideIndex((prevIndex) =>
        Math.min(prevIndex + 1, slides.length - 1)
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goToPreviousSlide();
      else if (event.key === "ArrowRight" || event.key === " ") goToNextSlide();
      else if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative w-full max-w-[195vw] max-h-[95vh] aspect-video shadow-2xl rounded-xl overflow-hidden"
          style={{
            backgroundImage: currentTheme.gradientBackground,
            backgroundColor: currentTheme.slideBackgroundColor,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`w-full h-full flex ${
                onlyText
                  ? "items-center justify-center text-center px-32"
                  : "px-16 py-12 "
              }`}
              style={{
                color: currentTheme.accentColor,
                fontFamily: currentTheme.fontFamily,
              }}
            >
              {/* TEXT ONLY SLIDE */}
              {onlyText ? (
                <div className="w-full max-w-5xl mx-auto flex flex-col space-y-8">
                  <MasterRecursiveComponent
                    content={currentSlide.content}
                    onContentChange={() => {}}
                    slideId={currentSlide.id}
                    isPreview={false}
                    isEditable={false}
                    index={currentSlideIndex}
                  />
                </div>
              ) : (
                /* NORMAL LAYOUT (IMAGE + TEXT) */
                <MasterRecursiveComponent
                  content={currentSlide.content}
                  onContentChange={() => {}}
                  slideId={currentSlide.id}
                  isPreview={false}
                  isEditable={false}
                  index={currentSlideIndex}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Close Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-20"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>

          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-6 -translate-y-1/2 z-20"
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-6 -translate-y-1/2 z-20"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PresentationMode;