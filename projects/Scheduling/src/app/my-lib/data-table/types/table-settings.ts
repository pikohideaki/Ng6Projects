import { HeaderSetting } from './header-setting';

export class TableSettings {
  headerSettings:      HeaderSetting[] = [];
  itemsPerPageOptions: number[]        = [];
  itemsPerPageInit:    number          = 50;
  displayNo?:          boolean         = false;
  usepagination?:      boolean         = true;

  constructor() {}
}
