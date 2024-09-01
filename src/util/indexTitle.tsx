import React from "react";

export const indexTitle = (id: string | undefined): string | React.ReactNode => {
  if (!id) {
    return <p id="pages.title.list"  >列表</p>;
  }
  if (id && id !== 'create') {
    return <p id="pages.title.list"  >编辑</p>;
  }
  return <p id="pages.title.list"  >新增</p>;
};
