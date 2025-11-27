import React from 'react';
import { ContentBlock } from '@/lib/learnParser';
import CodeBlock from './CodeBlock';
import NoteCard from './NoteCard';

interface ChapterCardProps {
  block: ContentBlock;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      const HeadingTag = `h${block.level || 3}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag className={`
          font-bold text-foreground
          ${block.level === 3 ? 'text-2xl mt-6 mb-3' : 'text-xl mt-4 mb-2'}
        `}>
          {block.content}
        </HeadingTag>
      );

    case 'text':
      return (
        <p className="text-foreground/90 leading-relaxed">
          {block.content}
        </p>
      );

    case 'code':
      return <CodeBlock code={block.content} language={block.language} />;

    case 'list':
      const items = block.content.split('\n').map(item => item.replace(/^[\-\*] /, ''));
      return (
        <ul className="space-y-2 ml-4">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-primary mt-1.5">▸</span>
              <span className="text-foreground/90 flex-1">{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'note':
      return <NoteCard content={block.content} />;

    case 'separator':
      return <div className="border-t border-border my-8" />;

    default:
      return null;
  }
};

export default ChapterCard;