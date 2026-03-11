"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FileSummarizer = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [keyConcepts, setKeyConcepts] = useState("");
  const [summary, setSummary] = useState("");
  const [importantPoints, setImportantPoints] = useState("");
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([]);

  const [translatedContent, setTranslatedContent] = useState("");
  const [selectedLang, setSelectedLang] = useState("hi");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
  };

  const handleGenerate = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/summarize-file", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const text = data.summary || "";

      const titleMatch = text.match(/TITLE:\s*(.*)/i);
      const conceptsMatch = text.match(/KEY CONCEPTS:\s*([\s\S]*?)(SUMMARY:|IMPORTANT POINTS:)/i);
      const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)(IMPORTANT POINTS:|LEARNING INSIGHTS:)/i);
      const importantMatch = text.match(/IMPORTANT POINTS:\s*([\s\S]*)/i);

      setTitle(titleMatch?.[1]?.trim() || "");
      setKeyConcepts(conceptsMatch?.[1]?.trim() || "");
      setSummary(summaryMatch?.[1]?.trim() || "");
      setImportantPoints(importantMatch?.[1]?.trim() || "");

      setYoutubeLinks(data.youtubeLinks || []);

      toast.success("Generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    const fullText = `
${title}

${keyConcepts}

${summary}

${importantPoints}
`;

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: fullText,
        lang: selectedLang,
      }),
    });

    const data = await response.json();

    setTranslatedContent(data.translatedText);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Upload Section */}
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".txt,.pdf,.doc,.docx,.ppt,.pptx"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {/* Title */}
      {title && (
        <div className="p-6 rounded-xl bg-black text-white shadow-md">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      )}

      {/* Key Concepts */}
      {keyConcepts && (
        <div className="p-6 rounded-xl bg-primary/10 shadow-md prose">
          <h2>Key Concepts</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {keyConcepts}
          </ReactMarkdown>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="p-6 rounded-xl bg-primary/10 shadow-md prose">
          <h2>Summary</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {summary}
          </ReactMarkdown>
        </div>
      )}

      {/* Important Points */}
      {importantPoints && (
        <div className="p-6 rounded-xl bg-primary/10 shadow-md prose">
          <h2>Important Points</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {importantPoints}
          </ReactMarkdown>
        </div>
      )}

      {/* YouTube Links */}
      {youtubeLinks.length > 0 && (
        <div className="p-6 rounded-xl bg-secondary/10 shadow-md">
          <h2 className="text-xl font-bold mb-3">Related YouTube Videos</h2>

          <ul className="list-disc ml-6 space-y-2">
            {youtubeLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Translation */}
      {(title || summary || importantPoints) && (
        <div className="space-y-4">

          <div className="flex gap-4 ">
            <select
              className="border p-2 rounded-md  cursor-pointer"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
                <option value="hi"  >Hindi</option>
  <option value="te">Telugu</option>
  <option value="ta">Tamil</option>
  <option value="kn">Kannada</option>
  <option value="ml">Malayalam</option>
  <option value="mr">Marathi</option>
  <option value="bn">Bengali</option>
  <option value="gu">Gujarati</option>
  <option value="pa">Punjabi</option>
  <option value="ur">Urdu</option>

  <option value="en">English</option>
  <option value="fr">French</option>
  <option value="es">Spanish</option>
  <option value="de">German</option>
  <option value="it">Italian</option>
  <option value="pt">Portuguese</option>
  <option value="ru">Russian</option>
  <option value="ar">Arabic</option>
  <option value="zh-cn">Chinese (Simplified)</option>
  <option value="ja">Japanese</option>
  <option value="ko">Korean</option>
            </select>

            <Button onClick={handleTranslate}   className="cursor-pointer">
              Translate
            </Button>
          </div>

          {translatedContent && (
            <div className="p-6 rounded-xl  bg-primary/10 shadow-md prose">
              <h2>Translated Content</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {translatedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileSummarizer;