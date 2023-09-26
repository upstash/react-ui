"use client";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PodcastEmptyPlaceholder } from "@/components/podcast-empty-placeholder";
import { Sidebar } from "@/components/sidebar";
import { playlists } from "@/data/playlists";

export default function MusicPage() {
  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "rgb(250,250,250)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          maxHeight: "40rem",
          maxWidth: "64rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
          <div className="hidden md:block">
            <div className="border-t">
              <div className="bg-background">
                <div className="grid lg:grid-cols-5">
                  <Sidebar playlists={playlists} className="hidden lg:block" />
                  <div className="col-span-3 lg:col-span-4 lg:border-l">
                    <div className="h-full px-4 py-6 lg:px-8">
                      <Tabs defaultValue="podcasts" className="h-full space-y-6">
                        <div className="flex items-center space-between">
                          <TabsList>
                            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                            <TabsTrigger value="live" disabled>
                              Live
                            </TabsTrigger>
                          </TabsList>
                          <div className="ml-auto mr-4">
                            <Button>
                              <PlusCircledIcon className="w-4 h-4 mr-2" />
                              Add music
                            </Button>
                          </div>
                        </div>

                        <TabsContent
                          value="podcasts"
                          className="h-full flex-col border-none p-0 data-[state=active]:flex"
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h2 className="text-2xl font-semibold tracking-tight">
                                New Episodes
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Your favorite podcasts. Updated daily.
                              </p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <PodcastEmptyPlaceholder />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
