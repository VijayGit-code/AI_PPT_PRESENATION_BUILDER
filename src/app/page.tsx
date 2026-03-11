"use client";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col font-[family-name:var(--font-geist-sans)] text-white overflow-x-hidden">
 
      <div className="fixed inset-0 z-0">
        <Image
          src="/pack.jpg"
          alt="AI Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0a1128]/75" />
      </div>
 
       <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md  ">
  <div className="flex justify-between items-center p-8 w-full max-w-7xl mx-auto">

    <div className="font-bold text-xl flex items-center gap-3 tracking-widest text-white">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute inset-0 border border-white/40 rotate-45"></div>
        <div className="absolute inset-2 border border-white/60"></div>
      </div>
      SlideGenius AI
    </div>

    <div className="hidden md:flex gap-8 text-[16px] uppercase tracking-wider font-medium items-center text-white">
      <a href="#about" className="opacity-70 hover:opacity-100 transition">About</a>
      <a href="#features" className="opacity-70 hover:opacity-100 transition">Features</a>
      <Link href="/dashboard" className="opacity-70 hover:opacity-100 transition">
        Register
      </Link>
      <a href="#data" className="opacity-70 hover:opacity-100 transition">Contect</a>
    </div>

  </div>
</nav>

      {/* header section  */}
      <main className="relative z-10 flex-grow flex flex-col justify-center mt-20 pt-20">
        <div className="max-w-7xl mx-auto w-full px-8 grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              Create <br />
              Presentations <br />
              Effortlessly
            </h1>
          </div>
        </div>

        <div className="mt-[60px]" />

        <div className="w-full flex flex-col items-center">
          <Link
            href="/sign-in"
            className="px-10 py-3 bg-[#FFF9C4] text-gray-900 text-xs font-black rounded-full shadow-[0_0_30px_rgba(255,249,196,0.5)] hover:scale-105 transition-all uppercase tracking-tighter"
          >
            Get Started – It’s Free
          </Link>

          <span className="mt-4 text-white/50 text-[10px] tracking-widest uppercase text-center">
            Trusted by professionals
          </span>
        </div>
      </main>
 
      <section id="featuress" className="relative z-10 w-full py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="IDEA TO SLIDES IN SECONDS"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 10H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"
                />
              }
            />
            <FeatureCard
              title="DATA VISUALIZATION SIMPLIFIED"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              }
            />
            <FeatureCard
              title="AI POWERED CONTENT GENERATION"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337 5.972 5.972 0 01-3.535 1.057.598.598 0 01-.83-.685l.015-.323c.11-.513.165-1.038.158-1.54C3.237 15.656 2.25 13.932 2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              }
            />
          </div>
        </div>
      </section> 
      {/* About the project section  */}
      <section id="about" className="relative z-10 w-full py-16 bg-white/5 backdrop-blur-md pt-20">
  <div className="max-w-5xl mx-auto px-4 text-center">
    <h2 className="text-4xl font-bold text-white mb-6">About AI PPT Builder</h2>
     
    <p className="text-lg text-gray-200 leading-relaxed mb-6">
      AI PPT Presentation Builder is a cutting-edge tool designed to automate and simplify the creation of professional presentations. 
      Using advanced artificial intelligence and natural language processing (NLP) models, it can summarize large documents, extract key points, and generate slides automatically based on user input. 
      Users can input text, images, and bullet points, and the AI organizes them logically across slides while providing intelligent suggestions for layout, themes, fonts, colors, and content formatting. 
      The platform also includes predefined templates for business, academic, and creative purposes, supports real-time editing and instant preview, and generates smart graphics, charts, and tables for effective data visualization. 
      AI PPT Builder empowers students, professionals, and educators to quickly transform ideas into polished, professional presentations, saving time and enhancing productivity.
    </p>
 
    <p className="text-lg text-gray-200 leading-relaxed">
      The project is built with a modern and robust tech stack to ensure smooth performance and scalability. 
      The frontend uses <strong>Next.js  </strong> to create a dynamic and responsive user interface, while the backend is powered by <strong>OpenAI API</strong> for efficient API handling. 
      User data, templates, and generated slides are securely stored in <strong>Prism</strong>, and <strong>PPTX libraries like PptxGenJS</strong> enable high-quality slide creation. 
      The AI engine leverages NLP models for summarization, keyword extraction, and intelligent slide generation, combining cutting-edge technologies to provide a seamless, efficient, and innovative presentation-building experience.
    </p>
  </div>
</section>
{/* Features section  */}
 <section  id="features"  className="relative z-10 w-full py-16 bg-white/5 backdrop-blur-md pt-20">
  <div className="max-w-6xl mx-auto px-6 space-y-20">
 
    <h2 className="text-4xl font-bold text-white text-center mb-12">
      Features of AI PPT Builder
    </h2>
 
    <div className="flex flex-col md:flex-row items-center gap-10">
      <div className="relative w-40 h-40 border-2 border-white/40 rounded-xl overflow-hidden flex-shrink-0 group">
        <img
          src="/damg.png"
          alt="Step 1"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <span className="text-white font-semibold text-center">
            Download Formats
          </span>
        </div>
      </div>

      <p className="text-white/80 text-lg leading-relaxed">
        The system allows users to download presentations in multiple formats such as PPTX and PDF.
        This ensures easy sharing, printing, and compatibility across different devices and platforms.
        Users can choose the preferred format based on their presentation or documentation needs.
      </p>
    </div> 
    <div className="flex flex-col md:flex-row-reverse items-center gap-5">
      <div className="relative w-40 h-40 border-2 border-white/40 rounded-xl overflow-hidden flex-shrink-0 group">
        <img
          src="/dom.png"
          alt="Step 2"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <span className="text-white font-semibold text-center">
            Auto Generation
          </span>
        </div>
      </div>

      <p className="text-white/80 text-lg leading-relaxed">
        The application automatically generates PowerPoint slides from user-provided input or prompts.
        This eliminates manual slide creation and significantly reduces time and effort.
        It helps users focus more on content quality rather than slide formatting.
      </p>
    </div>
 
    <div className="flex flex-col md:flex-row items-center gap-10">
      <div className="relative w-40 h-40 border-2 border-white/40 rounded-xl overflow-hidden flex-shrink-0 group">
        <img
          src="/damk.png"
          alt="Step 3"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <span className="text-white font-semibold text-center">
            Templates & Themes
          </span>
        </div>
      </div>

      <p className="text-white/80 text-lg leading-relaxed">
        Users can select from a variety of templates, themes, and design styles.
        This enables the creation of visually appealing and professional presentations.
        Customization ensures presentations match personal, academic, or corporate branding.
      </p>
    </div> 
    <div className="flex flex-col md:flex-row-reverse items-center gap-10">
      <div className="relative w-40 h-40 border-2 border-white/40 rounded-xl overflow-hidden flex-shrink-0 group">
        <img
          src="/domp.png"
          alt="Step 4"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <span className="text-white font-semibold text-center">
            Smart Layout
          </span>
        </div>
      </div>

      <p className="text-white/80 text-lg leading-relaxed">
        The AI intelligently organizes input content into well-structured slides.
        It converts raw text into headings, bullet points, and clear layouts.
        This improves readability, clarity, and overall presentation flow.
      </p>
    </div>

  </div>
</section>

{/* contect section */}
 
      <section id="data" className="relative z-10 w-full py-16 bg-white/5 backdrop-blur-md">
          
 <div className=" text-white py-12">
  <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center space-y-8">
 
     <div className="space-y-4"> 
  <h3 className="text-2xl font-bold text-white">SliderGeniun AI</h3>
   <div className="  p-4 rounded-xl shadow-lg flex justify-between items-center">
  <img 
    src="/just.png" 
    alt="Slide 1" 
    className="w-60 h-40 object-cover rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
  />
  <img 
    src="/PPT.png" 
    alt="Slide 2" 
    className="w-60 h-40 object-cover rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
  />
  <img 
    src="/fraud.jpeg" 
    alt="Slide 3" 
    className="w-60 h-40 object-cover rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
  />
  <img 
    src="/Ai.jpg" 
    alt="Slide 4" 
    className="w-60 h-40 object-cover rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
  />
</div>

 
   
  <p className="text-white/80">
    The AI PPT Presentation Builder is optimized with efficient AI algorithms that quickly analyze user input and generate slides in seconds. Its lightweight processing and prebuilt templates reduce load times, making the slide creation process fast and seamless. Smart content organization ensures minimal manual adjustments, while cloud integration allows instant saving and retrieval. Overall, it delivers high-speed, professional presentations without compromising quality.
  </p>
</div>
 
    <div className="space-y-4">
      <h4 className="text-xl font-semibold">Contact</h4>
      <p className="text-white/80">Email: vijaykarri220910125@gmail.com</p>
      <p className="text-white/80">Phone: +91 81439-57022</p>
    </div>

  </div>
 
  <div className="max-w-6xl mx-auto px-4 mt-12 border-t border-gray-800 pt-6 text-center text-white/50 text-sm space-y-2">
    <p>&copy; {new Date().getFullYear()} SliderGeniun AI. All rights reserved.</p>
    <div className="space-x-4">
      <a href="#" className="hover:text-blue-500">Terms of Service</a>
      <a href="#" className="hover:text-blue-500">Privacy Policy</a>
    </div>
  </div>
</div>



      </section>

    </div>
  );
}

function FeatureCard({ title, icon }: { title: string; icon: any }) {
  return (
    <div className="group cursor-pointer transition-all duration-300 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-10 flex flex-col items-center gap-6 hover:bg-white/10">
      <div className="text-white/80 group-hover:text-white transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-10 h-10"
        >
          {icon}
        </svg>
      </div>
      <div className="text-[10px] font-bold tracking-[0.15em] text-center leading-relaxed">
        {title}
      </div>
    </div>
  );
}
