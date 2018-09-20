import { ITableSettings } from './table-settings';
import { ObjectTableHeaderSetting } from './object-table-header-setting';

export interface IObjectTableSettings extends ITableSettings {
  headerSettings: ObjectTableHeaderSetting[];
}
