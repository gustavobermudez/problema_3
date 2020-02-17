import { IProcessLog } from 'app/shared/model/process-log.model';

export interface IFileContent {
  id?: number;
  fileDataContentContentType?: string;
  fileDataContent?: any;
  processLog?: IProcessLog;
}

export const defaultValue: Readonly<IFileContent> = {};
