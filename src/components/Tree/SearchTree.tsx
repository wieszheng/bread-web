import React, {useState} from 'react';
import './SearchTree.less';
import {Col, Input, Row, Tree, Dropdown} from "antd";
import type {MenuProps} from 'antd';
import {SearchOutlined, PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons"
import {FolderCode} from "@icon-park/react";


const dataList: any[] = [];
const SearchTree: React.FC<any> = ({
                                     treeData,
                                     menu,
                                     onAddNode,
                                     selectedKeys,
                                     onSelect,
                                     addDirectory,
                                   }) => {
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [nodeKey, setNodeKey] = useState(null);

  const getParentKey = (key: string, tree: any): string | undefined => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const onChange = (e: any) => {
    const {value} = e.target;
    const expandedKeys: any[] = dataList.map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, treeData);
      }
      return null;
    })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const loop = (data: any) =>
    data?.map((item: any) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substring(0, index);
      const afterStr = item.title.substring(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
              {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
            </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return {title, key: item.key, children: loop(item.children)};
      }

      return {
        title,
        key: item.key,
      };
    });

  const titleRender = (nodeData: any) => {
    return (
      <div onMouseOver={() => setNodeKey(nodeData.key)} onMouseLeave={() => setNodeKey(null)}>
        <FolderCode theme="outline" size="15" className="folder"/>
        {nodeData.title}
        {
          nodeKey === nodeData.key ? <span className="suffixButton"
          >
            <PlusOutlined onClick={(e) => {
              e.stopPropagation();
              onAddNode(nodeData)
            }} className="icon-left"/>
            <Dropdown overlay={menu(nodeData)} trigger={['click']}>
              <MoreOutlined className="icon-right" onClick={e => {
                e.stopPropagation()
              }}/>
            </Dropdown>
          </span> : null
        }
      </div>
    )
  };
  return (
    <div>
      <Row gutter={8}>
        <Col span={18}>
          <Input size="small" className="treeSearch" placeholder="输入要查找的目录"
                 onChange={onChange}
                 prefix={<SearchOutlined/>}/>
        </Col>
        <Col span={6}>
          {addDirectory}
        </Col>
      </Row>
      <Tree
        onExpand={onExpand}
        defaultExpandAll
        blockNode={true}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={loop(treeData)}
        titleRender={titleRender}
      />
    </div>
  );
};
export default SearchTree;
