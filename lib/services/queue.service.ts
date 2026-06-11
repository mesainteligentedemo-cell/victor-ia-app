export interface QueuedJob {
  id: string;
  type: "video" | "image";
  userId: string;
  status: "pending" | "processing" | "completed" | "failed";
  priority: "low" | "normal" | "high";
  createdAt: Date;
  metadata?: Record<string, any>;
  error?: string;
  result?: any;
}

export class QueueService {
  private queue: Map<string, QueuedJob> = new Map();
  private maxConcurrent = 5;
  private processing = 0;

  async addJob(job: QueuedJob): Promise<void> {
    this.queue.set(job.id, job);
  }

  async getJob(jobId: string): Promise<QueuedJob | undefined> {
    return this.queue.get(jobId);
  }

  async getQueueStatus(userId: string) {
    const jobs = Array.from(this.queue.values()).filter((j) => j.userId === userId);
    return {
      total: jobs.length,
      pending: jobs.filter((j) => j.status === "pending").length,
      processing: jobs.filter((j) => j.status === "processing").length,
      completed: jobs.filter((j) => j.status === "completed").length,
    };
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = this.queue.get(jobId);
    if (job && job.status === "pending") {
      job.status = "failed";
      job.error = "Cancelled by user";
    }
  }

  async retryJob(jobId: string): Promise<any> {
    const job = this.queue.get(jobId);
    if (job) {
      job.status = "pending";
      job.error = undefined;
    }
    return job;
  }
}
