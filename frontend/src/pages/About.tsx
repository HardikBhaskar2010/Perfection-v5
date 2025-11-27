import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
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
      <PageHeader
        title="About Hardik Bhaskar"
        description="Student | React & Python Expert | Game Developer | Lifelong Learner"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
            <Rocket className="w-12 h-12 text-white" />
          </div>
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-effect" enableAnimation>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1"><Code2 className="w-5 h-5 text-primary" /><CardTitle>Skills</CardTitle></div>
              <CardDescription>What I work with</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2 text-sm">
                {['React', 'TypeScript', 'Python', 'FastAPI', 'Tailwind', 'Firebase'].map((s) => (
                  <li key={s} className="px-3 py-1 rounded-full bg-muted">{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-effect" enableAnimation>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1"><Gamepad2 className="w-5 h-5 text-secondary" /><CardTitle>Game Dev</CardTitle></div>
              <CardDescription>Building and playing</CardDescription>
            </CardHeader>
            <CardContent>
              I love making and playing games. Experimentation and learning by doing keeps me growing.
            </CardContent>
          </Card>

          <Card className="glass-effect" enableAnimation>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1"><Github className="w-5 h-5 text-accent" /><CardTitle>Find me</CardTitle></div>
              <CardDescription>Profiles and contact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <a href="https://github.com/HardikBhaskar2010" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                  <Github className="w-4 h-4" /> github.com/HardikBhaskar2010 <ExternalLink className="w-3 h-3" />
                </a>
                {/* Add more socials or contact info when available */}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-effect" enableAnimation>
          <CardHeader>
            <CardTitle>Featured projects</CardTitle>
            <CardDescription>Some things I’ve built</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <Link key={p.name} to={p.url} target="_blank" className="group block p-4 rounded-lg border border-border hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-muted-foreground">{p.why}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default About;
