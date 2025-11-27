import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Search, Menu, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/layout/Navbar';
import { parseLearnContent, Chapter, ContentBlock } from '@/lib/learnParser';
import CodeBlock from '@/components/learn/CodeBlock';
import ChapterCard from '@/components/learn/ChapterCard';
import NoteCard from '@/components/learn/NoteCard';
import PageFlip from '@/components/learn/PageFlip';

const Learn: React.FC = () => {
  const [softwareContent, setSoftwareContent] = useState<Chapter[]>([]);
  const [hardwareContent, setHardwareContent] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('software');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageFlipDirection, setPageFlipDirection] = useState<'next' | 'prev' | null>(null);

  // Load content on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const [softwareRes, hardwareRes] = await Promise.all([
          fetch('/learn/software.txt'),
          fetch('/learn/hardware.txt')
        ]);

        const softwareText = await softwareRes.text();
        const hardwareText = await hardwareRes.text();

        setSoftwareContent(parseLearnContent(softwareText));
        setHardwareContent(parseLearnContent(hardwareText));
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const currentContent = activeTab === 'software' ? softwareContent : hardwareContent;
  const filteredContent = currentContent.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.content.some(block => 
      block.type === 'text' && block.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleNextChapter = () => {
    if (currentChapter < filteredContent.length - 1) {
      setPageFlipDirection('next');
      setTimeout(() => {
        setCurrentChapter(currentChapter + 1);
        setPageFlipDirection(null);
      }, 300);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      setPageFlipDirection('prev');
      setTimeout(() => {
        setCurrentChapter(currentChapter - 1);
        setPageFlipDirection(null);
      }, 300);
    }
  };

  const handleChapterSelect = (index: number) => {
    if (index !== currentChapter) {
      setPageFlipDirection(index > currentChapter ? 'next' : 'prev');
      setTimeout(() => {
        setCurrentChapter(index);
        setPageFlipDirection(null);
      }, 300);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentChapter(0);
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <BookOpen className="w-16 h-16 mx-auto animate-pulse text-primary" />
            <p className="text-lg text-muted-foreground">Loading educational content...</p>
          </div>
        </div>
      </div>
    );
  }

  const chapter = filteredContent[currentChapter];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center space-y-4">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gradient-primary rounded-full">
              <BookOpen className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white">Interactive Learning Hub</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore comprehensive guides on Software and Hardware fundamentals. Navigate through chapters like turning pages in a book!
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="software" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                  💻 Software
                </TabsTrigger>
                <TabsTrigger value="hardware" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                  🔧 Hardware
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="space-y-6">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search chapters and topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>

              {/* Main Content Layout */}
              <div className="grid md:grid-cols-[300px,1fr] gap-6">
                {/* Sidebar - Chapter Navigation */}
                <div className={`${sidebarOpen ? 'block' : 'hidden md:block'}`}>
                  <Card className="p-4 bg-card/50 backdrop-blur border-border sticky top-24">
                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                      Table of Contents
                    </h3>
                    <ScrollArea className="h-[calc(100vh-250px)]">
                      <div className="space-y-2">
                        {filteredContent.map((ch, index) => (
                          <button
                            key={index}
                            onClick={() => handleChapterSelect(index)}
                            data-testid={`chapter-nav-${index}`}
                            className={`
                              w-full text-left px-3 py-2 rounded-lg transition-all duration-200
                              ${currentChapter === index 
                                ? 'bg-gradient-primary text-white shadow-glow' 
                                : 'hover:bg-muted text-foreground'
                              }
                            `}
                          >
                            <div className="text-xs font-medium opacity-70 mb-1">Chapter {ch.number}</div>
                            <div className="text-sm font-semibold line-clamp-2">{ch.title}</div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </Card>
                </div>

                {/* Book Content Area */}
                <div className="relative">
                  <PageFlip direction={pageFlipDirection}>
                    <Card 
                      className="p-8 bg-card/80 backdrop-blur border-border shadow-2xl min-h-[600px]"
                      data-testid="book-content"
                    >
                      {chapter ? (
                        <div className="space-y-6">
                          {/* Chapter Header */}
                          <div className="border-b border-border pb-6">
                            <div className="text-sm font-medium text-primary mb-2">
                              Chapter {chapter.number}
                            </div>
                            <h2 className="text-3xl font-bold mb-4 text-gradient">
                              {chapter.title}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>📖 {filteredContent.length} Chapters</span>
                              <span>•</span>
                              <span>📄 Page {currentChapter + 1} of {filteredContent.length}</span>
                            </div>
                          </div>

                          {/* Chapter Content */}
                          <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-6">
                              {chapter.content.map((block, index) => (
                                <ChapterCard key={index} block={block} />
                              ))}
                            </div>
                          </ScrollArea>

                          {/* Navigation Footer */}
                          <div className="flex items-center justify-between pt-6 border-t border-border">
                            <Button
                              onClick={handlePrevChapter}
                              disabled={currentChapter === 0}
                              variant="outline"
                              className="gap-2"
                              data-testid="prev-chapter-btn"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Previous
                            </Button>
                            
                            <div className="flex gap-2">
                              {filteredContent.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleChapterSelect(index)}
                                  className={`
                                    w-2 h-2 rounded-full transition-all duration-200
                                    ${currentChapter === index 
                                      ? 'bg-primary w-8' 
                                      : 'bg-muted hover:bg-muted-foreground'
                                    }
                                  `}
                                  aria-label={`Go to chapter ${index + 1}`}
                                />
                              ))}
                            </div>

                            <Button
                              onClick={handleNextChapter}
                              disabled={currentChapter === filteredContent.length - 1}
                              variant="outline"
                              className="gap-2"
                              data-testid="next-chapter-btn"
                            >
                              Next
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg text-muted-foreground">No chapters found matching your search.</p>
                        </div>
                      )}
                    </Card>
                  </PageFlip>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Learn;