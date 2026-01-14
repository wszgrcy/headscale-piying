import { computed, inject, Injectable } from '@angular/core';
import { PI_VIEW_FIELD_TOKEN } from '@piying/view-angular';
import { AclSourceService } from '../../../service/acl-source.service';
import { SourceOption } from '../../source-list/type';

@Injectable()
export class AclService {
  #field$$ = inject(PI_VIEW_FIELD_TOKEN);
  #aclSource = inject(AclSourceService);

  groups$$ = computed(() => {
    const value = this.#field$$().get(['groups'])!.form.control!.value$$();
    return Object.keys(value ?? {}).map((value) => {
      return {
        label: value.slice('group:'.length),
        value: value,
      };
    });
  });
  hosts$$ = computed(() => {
    const value = this.#field$$().get(['hosts'])!.form.control!.value$$();
    return Object.keys(value ?? {}).map((value) => {
      return {
        label: value,
        value: value,
      };
    });
  });
  users$$ = computed(() => {
    return this.#aclSource.user$$();
  });
  username$$ = computed(() => {
    return this.#aclSource.user$.value().map((item) => {
      return {
        label: item.displayName || item.name || '',
        value: `${item.name}`,
      } as SourceOption;
    });
  });
  tagList$$ = computed(() => {
    const list = this.#aclSource.getNodeList$.value();
    const tagSet = new Set<string>();
    list.forEach((item) => {
      item.validTags?.forEach((tag) => {
        if (tag.startsWith('tag:')) {
          tagSet.add(tag);
        }
      });
      item.forcedTags?.forEach((tag) => {
        if (tag.startsWith('tag:')) {
          tagSet.add(tag);
        }
      });
      item.invalidTags?.forEach((tag) => {
        if (tag.startsWith('tag:')) {
          tagSet.add(tag);
        }
      });
    });
    return [...tagSet].map((item) => {
      return {
        label: item.slice('tag:'.length),
        value: item,
      };
    });
  });
  ipList$$ = computed(() => {
    const list = this.#aclSource.getNodeList$.value();
    return list
      .flatMap((item) => {
        return item.ipAddresses ?? [];
      })
      .sort()
      .map((item) => {
        return {
          label: item,
          value: item,
        };
      });
  });
  routes$$ = computed(() => {
    const list = this.#aclSource.getNodeList$.value();
    const tagSet = new Set<string>();
    list.forEach((item) => {
      item.subnetRoutes?.forEach((item) => {
        tagSet.add(item);
      });
      item.approvedRoutes?.forEach((item) => {
        tagSet.add(item);
      });
      item.availableRoutes?.forEach((item) => {
        tagSet.add(item);
      });
    });
    return [...tagSet].sort().map((item) => {
      return {
        label: item,
        value: item,
      };
    });
  });
}
