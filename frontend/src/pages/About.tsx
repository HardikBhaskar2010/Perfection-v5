import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Rocket, Gamepad2, Code2 } from 'lucide-react';

const About: React.FC = () => {
  const projects = [
    { name: 'ATAL Idea Generator', url: 'https://github.com/HardikBhaskar2010/atal_idea_generator', why: 'Arduino brainstorming and organization — making creativity accessible.' },
    { name: 'Calcu', url: 'https://github.com/HardikBhaskar2010/Calcu', why: 'A simple, user-friendly calculator app.' },
    { name: 'Streamit', url: 'https://github.com/HardikBhaskar2010/Streamit', why: 'A streaming platform prototype.' },
    { name: 'Notes', url: 'https://github.com/HardikBhaskar2010/Notes', why: 'A digital notebook of ideas and learnings.' },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-secondary/5 via-background to-background pt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto py-12">
            <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="relative p-1 bg-gradient-to-tr from-primary to-secondary rounded-3xl">
                  <div className="w-40 h-40 md:w-48 md:h-48 bg-muted rounded-[1.4rem] flex items-center justify-center overflow-hidden">
                    <Rocket className="w-20 h-20 text-primary animate-float" />
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-[0.2em] font-black px-3 py-1">Lead Developer</Badge>
                  <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gradient">
                    Hardik Bhaskar
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                  Student Architecting the future of STEM education through code and innovation. Specializing in <span className="text-primary font-bold">React</span> and <span className="text-secondary font-bold">Python</span>.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <a href="https://github.com/HardikBhaskar2010" target="_blank" rel="noreferrer">
                    <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-6 font-bold shadow-lg">
                      <Github className="w-4 h-4 mr-2" />
                      View Portfolio
                    </Button>
                  </a>
                  <Button variant="outline" className="rounded-xl px-6 font-bold border-border/60 hover:bg-muted/50">
                    Contact Explorer
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="glass-effect border-primary/10 shadow-sm hover:shadow-md transition-all group overflow-hidden" enableAnimation>
                <div className="h-1 w-full bg-primary/20" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Code2 className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-black uppercase tracking-wider">Tech Stack</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Core Capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Python', 'FastAPI', 'Tailwind', 'Supabase'].map((s) => (
                      <Badge key={s} variant="secondary" className="bg-muted/50 text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors border-none py-1.5 px-3 rounded-lg text-xs font-bold">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-secondary/10 shadow-sm hover:shadow-md transition-all group overflow-hidden" enableAnimation>
                <div className="h-1 w-full bg-secondary/20" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Gamepad2 className="w-5 h-5 text-secondary" />
                    </div>
                    <CardTitle className="text-lg font-black uppercase tracking-wider">Vision</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Beyond the code</CardDescription>
                </CardHeader>
                <CardContent className="text-sm font-medium leading-relaxed text-muted-foreground/90">
                  Passionate about merging high-fidelity UI with complex backends. My goal is to make advanced engineering accessible to everyone through intuitive software.
                </CardContent>
              </Card>

              <Card className="glass-effect border-accent/10 shadow-sm hover:shadow-md transition-all group overflow-hidden" enableAnimation>
                <div className="h-1 w-full bg-accent/20" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <ExternalLink className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle className="text-lg font-black uppercase tracking-wider">Network</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Connect with me</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a href="https://github.com/HardikBhaskar2010" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 transition-colors group/link border border-transparent hover:border-primary/10">
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5" />
                      <span className="text-xs font-bold">Source Code</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover/link:text-primary transition-colors" />
                  </a>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-black tracking-tight text-gradient">The Portfolio</h2>
                <div className="h-px flex-1 bg-border/40 mx-8 hidden md:block" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="group block">
                    <Card className="glass-effect border-primary/5 group-hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl relative">
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-5 h-5 text-primary" />
                      </div>
                      <CardHeader className="p-8">
                        <div className="space-y-3">
                          <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">
                            {p.name}
                          </h3>
                          <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-[90%]">
                            {p.why}
                          </p>
                        </div>
                      </CardHeader>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
