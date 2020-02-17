import { Moment } from 'moment';
import { IFileContent } from 'app/shared/model/file-content.model';

export interface IProcessLog {
  id?: number;
  fileName?: string;
  fileValue?: number;
  processDate?: Moment;
  fileDataContent?: IFileContent;
}

export const defaultValue: Readonly<IProcessLog> = {};
