import { HeaderSetting } from './header-setting';

export interface ITableSettings {
  headerSettings:      HeaderSetting[];
  itemsPerPageOptions: number[];
  itemsPerPageInit:    number;
  displayNo?:          boolean;
  usepagination?:      boolean;
}
