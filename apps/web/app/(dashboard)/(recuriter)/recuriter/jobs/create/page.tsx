'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hackhyre/ui/components/tabs'
import { MagicStar, DocumentText } from '@hackhyre/ui/icons'

import { AiMode } from '@/components/jobs/create/ai-mode'
import { FormMode } from '@/components/jobs/create/form-mode'

export default function CreateJobPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          Create a Job
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose how you&apos;d like to create your listing
        </p>
      </div>

      <Tabs defaultValue="ai" className="flex min-h-0 flex-1 flex-col">
        <TabsList variant="line" className="mb-6">
          <TabsTrigger value="ai" className="gap-1.5">
            <MagicStar size={16} variant="Linear" />
            AI
          </TabsTrigger>
          <TabsTrigger value="form" className="gap-1.5">
            <DocumentText size={16} variant="Linear" />
            Form
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="min-h-0 flex-1">
          <AiMode />
        </TabsContent>
        <TabsContent value="form">
          <FormMode />
        </TabsContent>
      </Tabs>
    </div>
  )
}
