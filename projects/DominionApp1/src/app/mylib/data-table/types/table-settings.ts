import { IHeaderSetting } from './header-setting';

export interface ITableSettings {
  headerSettings:      IHeaderSetting[];
  itemsPerPageOptions: number[];
  itemsPerPageInit:    number;
  displayNo?:          boolean;
  usepagination?:      boolean;
}

export const defaultSetting = (): ITableSettings => ({
  headerSettings:      [],
  itemsPerPageOptions: [25, 50, 100],
  itemsPerPageInit:    25,
  displayNo:           false,
  usepagination:       true,
});
