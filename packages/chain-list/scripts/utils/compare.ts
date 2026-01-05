import { flattenObject } from "./object";

export interface CompareObject {
  from: any,
  to: any
}
export type CompareMap = Record<string, CompareObject>;

export function compareObjects(obj1: Record<string, any>, obj2: Record<string, any>, ignoredKeys: string[] = []): CompareMap {
  const o1 = {} as Record<string, any> ;
  const o2 = {} as Record<string, any> ;
  const comparedKeys = new Set<string>();

  Object.entries(obj1).forEach(([key, value]) => {
    if (!ignoredKeys.includes(key)) {
      o1[key] = value;
    }
    comparedKeys.add(key);
  });

  Object.entries(obj2).forEach(([key, value]) => {
    if (!ignoredKeys.includes(key)) {
      o2[key] = value;
    }
    comparedKeys.add(key);
  });

  const differences = {} as Record<string, { from: any; to: any }>;
  for (const key of comparedKeys) {
    if (o1[key] !== o2[key]) {
      differences[key] = { from: o1[key], to: o2[key] };
    }
  }
  return differences;
}

export function compareData<T extends Record<string, any>>(o1: T, o2: T, ignoredKeys: string[] = []): CompareMap {
  // Flatten chain object
  const fo1 = flattenObject(o1);
  const fo2 = flattenObject(o2);

  return compareObjects(fo1, fo2, ignoredKeys);
}

export function readCompare(rMap: CompareMap) {
  return Object.fromEntries(Object.entries(rMap).map(([key, { from, to }]) => {
    let reportRs = `${JSON.stringify(from)} => ${JSON.stringify(to)}`;
    if (from === undefined || from === null) {
      reportRs = `Add ${JSON.stringify(to)}`;
    } else if (to === undefined || to === null) {
      reportRs = `Remove ${JSON.stringify(from)}`;
    }

    return [key, reportRs];
  }));
}

export function reportCompare(rMap: CompareMap, title = 'Compare') {
  console.log(`### ${title}`);
  for (const [key, { from, to }] of Object.entries(rMap)) {
    let reportRs = `${JSON.stringify(from)} => ${JSON.stringify(to)}`;
    if (from === undefined) {
      reportRs = `Add ${JSON.stringify(to)}`;
    } else if (to === undefined) {
      reportRs = `Remove ${JSON.stringify(from)}`;
    }

    console.log(`${key}: ${reportRs}`);
  }
}
