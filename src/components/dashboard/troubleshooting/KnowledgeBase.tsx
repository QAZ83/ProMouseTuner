import React, { useState } from "react";
import { Search, BookOpen, Tag, Clock, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  helpfulCount: number;
}

interface KnowledgeBaseProps {
  articles?: KnowledgeBaseArticle[];
}

const KnowledgeBase = ({ articles = defaultArticles }: KnowledgeBaseProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      activeCategory === "all" || article.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full bg-background p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Find solutions to common issues and learn more about ProMouseTuner
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for solutions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="calibration">Calibration</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ArticlesList articles={filteredArticles} />
          </TabsContent>

          <TabsContent value="calibration" className="mt-6">
            <ArticlesList articles={filteredArticles} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <ArticlesList articles={filteredArticles} />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <ArticlesList articles={filteredArticles} />
          </TabsContent>

          <TabsContent value="troubleshooting" className="mt-6">
            <ArticlesList articles={filteredArticles} />
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger>
                How do I calibrate my mouse for the first time?
              </AccordionTrigger>
              <AccordionContent>
                To calibrate your mouse for the first time, navigate to the
                Calibration tab and click on "Start New Calibration". Follow the
                on-screen instructions to complete the accuracy, speed, and
                tracking tests. Once completed, you'll receive recommended
                settings that you can apply automatically or adjust manually.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger>
                Why does my mouse feel different in different games?
              </AccordionTrigger>
              <AccordionContent>
                Different games may use different mouse input processing
                methods. ProMouseTuner allows you to create game-specific
                profiles to optimize your mouse settings for each game. Navigate
                to the Settings tab and select "Game-Specific Profiles" to
                create and manage these profiles.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger>
                How often should I recalibrate my mouse?
              </AccordionTrigger>
              <AccordionContent>
                We recommend recalibrating your mouse every 2-3 months, or
                whenever you change your physical setup (new mousepad, desk
                height, etc.). You should also recalibrate if you notice any
                inconsistencies in your mouse performance or if you've installed
                new drivers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger>
                What do the performance metrics mean?
              </AccordionTrigger>
              <AccordionContent>
                The performance metrics track various aspects of your mouse
                usage. "Accuracy" measures how precisely you hit targets,
                "Speed" tracks how quickly you move between points, and
                "Tracking" evaluates how smoothly your mouse follows your
                intended path. These metrics help identify areas for improvement
                and optimization.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

const ArticlesList = ({ articles }: { articles: KnowledgeBaseArticle[] }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No articles found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Tag className="h-3 w-3" />
              <span>{article.category}</span>
              <span className="mx-1">•</span>
              <Clock className="h-3 w-3" />
              <span>{article.lastUpdated}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{article.content}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              Read More
            </Button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ThumbsUp className="h-3 w-3" />
              <span>{article.helpfulCount}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const defaultArticles: KnowledgeBaseArticle[] = [
  {
    id: "1",
    title: "How to Optimize Mouse Settings for FPS Games",
    category: "performance",
    content:
      "This guide covers the optimal mouse settings for first-person shooter games. Learn how to adjust DPI, polling rate, and acceleration settings to improve your aim and reaction time in competitive play.",
    tags: ["FPS", "Gaming", "Optimization"],
    lastUpdated: "2 days ago",
    helpfulCount: 128,
  },
  {
    id: "2",
    title: "Troubleshooting Mouse Tracking Issues",
    category: "troubleshooting",
    content:
      "If your mouse cursor is jumping, skipping, or moving erratically, this article will help you identify and fix common tracking problems. Learn about sensor cleaning, surface compatibility, and driver troubleshooting.",
    tags: ["Tracking", "Troubleshooting", "Hardware"],
    lastUpdated: "1 week ago",
    helpfulCount: 95,
  },
  {
    id: "3",
    title: "Understanding Mouse DPI and Sensitivity",
    category: "settings",
    content:
      "A comprehensive explanation of mouse DPI (dots per inch) and sensitivity settings. Learn how these settings affect your mouse movement and how to find the perfect balance for your gaming style and preferences.",
    tags: ["DPI", "Sensitivity", "Settings"],
    lastUpdated: "3 days ago",
    helpfulCount: 210,
  },
  {
    id: "4",
    title: "Complete Guide to Mouse Calibration",
    category: "calibration",
    content:
      "This step-by-step guide walks you through the complete mouse calibration process. Learn how to use ProMouseTuner's calibration tools to optimize accuracy, speed, and tracking for your specific mouse and setup.",
    tags: ["Calibration", "Setup", "Accuracy"],
    lastUpdated: "5 days ago",
    helpfulCount: 176,
  },
  {
    id: "5",
    title: "Creating Game-Specific Mouse Profiles",
    category: "settings",
    content:
      "Learn how to create and manage custom mouse profiles for different games. This guide explains how to optimize settings for various game genres and how to set up automatic profile switching when launching games.",
    tags: ["Profiles", "Games", "Customization"],
    lastUpdated: "2 weeks ago",
    helpfulCount: 83,
  },
  {
    id: "6",
    title: "Fixing Input Lag and Acceleration Issues",
    category: "troubleshooting",
    content:
      "If you're experiencing input lag or unwanted mouse acceleration, this troubleshooting guide will help you identify and resolve these issues. Learn about driver settings, hardware limitations, and software optimizations.",
    tags: ["Input Lag", "Acceleration", "Troubleshooting"],
    lastUpdated: "4 days ago",
    helpfulCount: 142,
  },
];

export default KnowledgeBase;
