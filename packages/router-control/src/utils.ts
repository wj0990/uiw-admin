import React from 'react';
export interface Routers {
  path?: string;
  key?: string;
  name?: string;
  icon?: string;
  element?: JSX.Element;
  component?: string;
  routes?: Routers[];
  children?: Routers[]
}

export function getRouterList(data: Routers[] = [], treeList: Routers[] = []) {
  data.forEach((node) => {
    if (node.routes) {
      treeList = getRouterList(node.routes, treeList);
    } else if (node.path) {
      node.key = node.path;
      treeList.push(node);
    }
  });
  return treeList;
}
