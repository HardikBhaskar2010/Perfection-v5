import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'cpp' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="relative overflow-hidden rounded-lg border border-border bg-black/40">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground uppercase">{language}</span>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm font-mono text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;