import { IHeaderSetting } from './header-setting';

export interface ITableSettings {
  headerSettings:      IHeaderSetting[];
  itemsPerPageOptions: number[];
  itemsPerPageInit:    number;
  displayNo?:          boolean;
  usepagination?:      boolean;
}
