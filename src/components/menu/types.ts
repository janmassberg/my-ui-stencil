export interface IMenuItem {
  label: string;
  name: string;
  icon?: string;
  items?: IMenuItem[];
}
