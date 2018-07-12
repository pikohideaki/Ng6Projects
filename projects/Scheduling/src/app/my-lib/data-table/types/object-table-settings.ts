import { TableSettings } from './table-settings';
import { ObjectTableHeaderSetting } from './object-table-header-setting';

export class ObjectTableSettings extends TableSettings {
  headerSettings: ObjectTableHeaderSetting[];

  constructor() { super(); }
}
