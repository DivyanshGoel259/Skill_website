"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Components } from 'react-markdown';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
      title="Copy snippet"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

export function ClientMarkdown({ content }: { content: string }) {
  const components: Components = {
    code({ node, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      
      if (match) {
        return (
          <div className="relative group overflow-hidden rounded-lg my-4 bg-black/50 border border-white/10 p-4">
             <CopyButton text={String(children).replace(/\n$/, '')} />
             <pre className="overflow-x-auto text-sm">
               <code className={className} {...props}>
                 {children}
               </code>
             </pre>
          </div>
        );
      }
      return (
        <code className="bg-white/10 rounded px-1.5 py-0.5 text-brand-purple" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
