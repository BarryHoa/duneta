import type { StorageConfig } from '../../configs/storage.js';
import { BaseStorageController } from '../base-storage-controller.js';

/** Default storage controller — register as `StorageController` in DI. */
export class StorageController extends BaseStorageController {
  constructor(config: StorageConfig) {
    super(config);
  }
}
