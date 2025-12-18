import {HttpParams} from '@angular/common/http';

export function toHttpParams(params: Record<string, any> | null | undefined): HttpParams | undefined {
  if (!params) {
    return undefined;
  }

  const filteredEntries = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => [key, String(v)]);
      }
      return [[key, String(value)]];
    });

  return new HttpParams({fromObject: Object.fromEntries(filteredEntries)});
}
