"use client";
import { MinusCircledIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PodcastEmptyPlaceholder } from "@/components/podcast-empty-placeholder";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { TTLDialog } from "@/components/databrowser/ttl-dialog";

export default function Databrowser() {
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
                <div className="grid lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
                  <Sidebar />
                  <div className="col-span-4 lg:border-l">
                    <div className="h-full px-4 py-6 lg:px-8">
                      <div className="h-full space-y-6">
                        <div className="flex items-center space-between">
                          <TTLDialog>
                            <Button variant="outline" className="text-sm border-dashed">
                              TTL: 81764974s
                            </Button>
                          </TTLDialog>
                          <div className="ml-auto mr-4">
                            <Button>
                              <MinusCircledIcon className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="h-full flex-col border-none p-0 data-[state=active]:flex">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex gap-3">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                  0pVPr:55TKNa
                                </h2>
                                <Badge
                                  variant="secondary"
                                  className="text-white bg-green-500 rounded pointer-events-none"
                                >
                                  String
                                </Badge>
                              </div>
                              <p className="text-lg font-medium text-muted-foreground">Content</p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <PodcastEmptyPlaceholder />
                        </div>
                      </div>
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
