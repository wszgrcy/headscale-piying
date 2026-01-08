import { ResourceRef } from '@angular/core';
import { Observable } from 'rxjs';
import * as v from 'valibot';
export enum SourceType {
  any,
  user,
  Group,
  ip,
  cidr,
  host,
  tag,
  autogroup,
  autogroupAll,
}
export interface SourceOption {
  //   type: SourceType;
  // type: 'list' | 'item';
  label?: string;
  value?: string;
  children$$?: ResourceRef<SourceOption[]>;
  children?: SourceOption[];
  prefix?: string;

  define?: v.BaseSchema<any, any, any>;
}
