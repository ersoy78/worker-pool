declare module "worker-pool";
import { EventEmitter } from "events";

export interface WorkerPoolOptions {
  poolSize: number;
  workerFunction: (task: any) => Promise<any>;
  taskList: any[];
  retry?: boolean;
  delay?: number;
}

export interface WorkerPoolResults {
  ok: any[];
  fail: { item: any; error: Error }[];
}

export class WorkerPool extends EventEmitter {
  constructor(options: WorkerPoolOptions);

  info(): void;

  add(worker: any): void;

  push(task: any, unique?: boolean): void;

  isQueued(worker: any): boolean;

  list(): any[];

  isWorking(): boolean;

  remove(worker: any): void;

  idle(): void;

  stopIdle(): void; // Renamed 'off' to 'stopIdle'

  start(): Promise<WorkerPoolResults>;
}
