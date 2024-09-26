import React, {useEffect, useState} from 'react'
import type {ReactNode} from 'react'
import {
  deleteTestcaseDirectory,
  getListTestcaseDirectory,
  postTestcaseDirectory,
  putTestcaseDirectory
} from "@/services/admin/testcase";
import {getProjects} from "@/services/admin/project";
import {ModalForm, PageContainer, ProCard, ProColumns, ProFormText, ProTable} from "@ant-design/pro-components";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Result,
  Row,
  Select,
  Tooltip,
  Tree
} from "antd";
import SplitPane from "react-split-pane";
import ScrollCard from "@/components/Scrollbar/ScrollCard";
import {PROJECT_AVATAR_URL} from "@/constan";
import {Switch,FolderCode} from "@icon-park/react";
import {
  PlusOutlined,
  MoreOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined, ExportOutlined, EditTwoTone, DeleteTwoTone, DownOutlined, PlayCircleOutlined
} from "@ant-design/icons";
import "./index.less"
import noRecord from "@/assets/no_record.svg";
import emptyWork from "@/assets/emptyWork.svg"
import {useSetState} from "ahooks";
import {Access} from "@/components/Boot/Access";
import {deleteAddressId} from "@/services/admin/address";

interface IProps {
  children?: ReactNode
}

const {Option} = Select;
const {confirm} = Modal;
type operateType = "add" | "see" | "up";
type ModalType = {
  operateType: operateType;
  currentNode: any | null;
  record: any;
};

const TestCaseRecorder: React.FC<IProps> = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [directories, setDirectories] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [showToolIndex, setShowToolIndex] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [rootModal, setRootModal] = useState<boolean>(false);
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    currentNode: null,
    record: {}
  });
  const [searchValue, setSearchValue] = useState('');

  const [form] = Form.useForm<{ name: string; company: string }>();
  const [parentId, setParentId] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  // 获取项目列表
  useEffect(() => {
    getProjects({current: 1, pageSize: 99}).then(resp => {
      setProjects(resp.result.data);
      if (resp.result.data.length > 0) {
        setSelectedProjectId(resp.result.data[0].id); // 默认选择第一个项目

      }
    })
  }, []);

  // 根据选择的项目ID获取目录列表
  useEffect(() => {
    if (selectedProjectId) {
      getListTestcaseDirectory({project_id: selectedProjectId}).then(resp => {
        setDirectories(resp.result.data);
        setCurrentDirectory(resp.result.data?.length > 0 ? [resp.result.data[0].key] : []);
      })
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (currentDirectory.length) {
      setParentId(currentDirectory[0]);
    }
  }, [currentDirectory]);
  // 修改、新增或删除目录后刷新目录数据
  const refreshDirectories = async () => {
    if (selectedProjectId) {
      getListTestcaseDirectory({project_id: selectedProjectId}).then(resp => {
        setDirectories(resp.result.data);
      })
    }
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
  const filterTreeData = (treeData: any, searchValue: string) => {
    let expandedKeys: string[] = [];
    treeData.forEach((item: any) => {
      if (item.title.indexOf(searchValue) > -1) {
        expandedKeys.push(item.key);
      }
      if (item.children) {
        expandedKeys = expandedKeys.concat(filterTreeData(item.children, searchValue))
      }
    });
    return expandedKeys;
  };
  const onSearch = (value:string) => {
    setSearchValue(value);
    const filteredKeys = filterTreeData(directories, value);
    setExpandedKeys(filteredKeys);
  };
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      width: '5%',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: 'KEY',
      key: 'key',
      dataIndex: 'key',
      search: false,
    },
    {
      title: 'VALUE',
      key: 'value',
      dataIndex: 'value',
      search: false,
    },
    {
      title: 'DESCRIPTION',
      key: 'description',
      dataIndex: 'description',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      width: '12%',
      render: (_, record) => [
        <Access key={'update'} accessible={true}>
          <Tooltip placement="top" title="修改">
            <EditTwoTone
              style={{cursor: 'pointer'}}
            />
          </Tooltip>
        </Access>,
        <Access key={'delete'}>
          <Popconfirm
            key='delete'
            title='删除'
            description={'您确定要删除此记录吗?'}
            okText={'好的'}
            cancelText={'取消'}
            onConfirm={async () => {
              await deleteAddressId({address_id: record.id});
              // actionRef.current?.reload()
            }}
          >
            <Tooltip placement="top" title="删除">
              <DeleteTwoTone
                style={{cursor: 'pointer', marginLeft: 8}}
                onClick={() => {
                  // onDelete(columnType, record.id);
                }}
                twoToneColor="#eb2f96"
              />
            </Tooltip>

          </Popconfirm>
        </Access>,
      ]
    }
  ]
  return (
    <PageContainer>
      {
        projects.length === 0 ? (
          <Result
            status="404"
            subTitle={
              <span>
                    你还没有添加任何项目 <a href="/project">添加项目</a> 后才能编写Case
                  </span>
            }
          />

        ) : (
          <ProCard
            style={{height: '100%', minHeight: 600}}
            bodyStyle={{padding: 0}}
            bordered={false}
          >
            <Row>
              <ModalForm
                title={{add: "新增", up: "修改", see: "查看信息"}[modal.operateType]}
                width="450px"
                open={rootModal}
                form={form}
                onOpenChange={setRootModal}
                onFinish={async (values) => {
                  const params = {
                    name: values.name,
                    project_id:selectedProjectId,
                    parent: modal.currentNode,
                  };
                  if (modal.operateType === "add") {
                    // 新增
                    const res = await postTestcaseDirectory(params);
                    if (res?.success) {
                      message.success(res?.message);
                    }
                  }
                  if (modal.operateType === "up") {
                    // 修改
                    const res = await putTestcaseDirectory({...params, id: modal.record.id})
                    if (res?.success) {
                      message.success(res?.message);
                    }
                  }
                  setRootModal(false);
                  await refreshDirectories();
                }}
              >
                <ProFormText
                  name='name'
                  label={'目录名称'}
                  placeholder='请输入目录名称'
                  rules={[
                    {
                      required: true,
                      message: '请输入目录名称, 不超过18个字符!',
                    },
                  ]}
                />
              </ModalForm>
              <SplitPane
                split={'vertical'}
                minSize={260}
                defaultSize={300}
                maxSize={800}
              >
                <ScrollCard className={'card'} hideOverflowX={true}>
                  <Row gutter={8}>
                    <Col span={24}>
                      <div style={{height: 40, lineHeight: '40px'}}>
                        {
                          editing ? (
                            <Select
                              style={{marginLeft: 32, width: 150}}
                              showSearch
                              allowClear
                              placeholder="请选择项目"
                              defaultValue={selectedProjectId}
                              autoFocus={true}
                              onChange={(e) => {
                                if (e !== undefined) {
                                  setSelectedProjectId(e);
                                }
                                setEditing(false);
                              }}
                              filterOption={(input: string, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {projects.map((v: any) => (
                                <Option key={v.id} value={v.id}>
                                  {v.name}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <div onClick={() => setEditing(true)}>
                              <Avatar
                                style={{marginLeft: 8, marginRight: 6}}
                                size="large"
                                src={projects.filter((p: any) => p.id === selectedProjectId)[0]["avatar"] || PROJECT_AVATAR_URL}
                              />
                              <span
                                style={{
                                  display: 'inline-block',
                                  marginLeft: 12,
                                  fontWeight: 400,
                                  fontSize: 14,
                                }}
                              >
                              {projects.filter((p: any) => p.id === selectedProjectId)[0]["name"]}
                            </span>
                              <Switch
                                style={{marginLeft: 12, cursor: 'pointer', lineHeight: '40px'}}
                                theme="outline"
                                size="16"
                                fill="#7ed321"
                              />
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <div style={{marginTop: 24}}>
                    {
                      directories.length > 0 ? (
                        <div>
                          <Row gutter={8}>
                            <Col span={18}>
                              <Input size="small" className="treeSearch" placeholder="输入要查找的目录"
                                     onChange={(e) => onSearch(e.target.value)}
                                     prefix={<SearchOutlined/>}/>
                            </Col>
                            <Col span={6}>
                              <Tooltip title="点击可新建根目录, 子目录需要在树上新建">
                                <a
                                  className="directoryButton"
                                  onClick={() => {
                                    setModal({
                                      operateType: 'add',
                                      currentNode: null,
                                      record: {name: ''},
                                    })
                                    setRootModal(true)
                                  }}
                                >
                                  <PlusOutlined/>
                                </a>
                              </Tooltip>
                            </Col>
                          </Row>
                          <Tree
                            blockNode={true}
                            defaultExpandAll
                            treeData={loop(directories)}
                            selectedKeys={currentDirectory}
                            onSelect={(_keys: any[]) => {
                              if (_keys && _keys.length) {
                                setCurrentDirectory(_keys);
                              }
                            }}
                            expandedKeys={expandedKeys}
                            onExpand={(_keys: any[]) => {
                              setExpandedKeys(_keys);
                            }}
                            titleRender={(nodeData: any) => {
                              return (
                                <div
                                  onMouseEnter={() => {
                                    setShowToolIndex(nodeData.key);
                                  }}
                                  onMouseLeave={() => {
                                    setShowToolIndex('');
                                  }}
                                >
                                  <FolderCode theme="outline" size="15" className="folder"/>
                                  {nodeData.title}
                                  {
                                    showToolIndex === nodeData.key ? (
                                      <span className="suffixButton">
                                      <PlusOutlined className="icon-left" onClick={(e) => {
                                        e.stopPropagation();
                                        setModal({
                                          operateType: 'add',
                                          currentNode: nodeData.key,
                                          record: {name: ''},
                                        })
                                        setRootModal(true)
                                      }}/>

                                      <Dropdown menu={{
                                        items: [
                                          {
                                            key: '1',
                                            label: <a onClick={() => {
                                              setModal({
                                                operateType: "up",
                                                record: {id: nodeData.key}
                                              })
                                              form.setFieldsValue({name: nodeData.title.props.children[2]})
                                              setRootModal(true)
                                            }}><EditOutlined/> 编辑目录</a>,
                                          },
                                          {
                                            key: '2',
                                            danger: true,
                                            label: <a onClick={() => {
                                              confirm({
                                                title: '确定删除该目录吗？',
                                                icon: <ExclamationCircleOutlined/>,
                                                content: '删除后，目录下的case也将不再可见！！！',
                                                okText: '确定',
                                                okType: 'danger',
                                                cancelText: '点错了',
                                                onOk() {
                                                  deleteTestcaseDirectory({id:nodeData.key}).then(async r => {
                                                    message.success(r?.message)
                                                    await refreshDirectories()
                                                  });

                                                },
                                              })
                                            }}><DeleteOutlined/> 删除目录</a>,
                                          },
                                        ],
                                      }} trigger={['click']}>
                                        <MoreOutlined className="icon-right"/>
                                      </Dropdown>
                                    </span>
                                    ) : null
                                  }
                                </div>
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <Empty
                          image={noRecord}
                          imageStyle={{
                            height: 180,
                          }}
                          description={
                            <span>
                            还没有目录，
                            <a
                              onClick={() => {
                                setModal({
                                  operateType: 'add',
                                  currentNode: null,
                                  record: {name: ''},
                                })
                                setRootModal(true)
                              }}
                            >
                              添加
                            </a>
                            一个吧~
                          </span>
                          }
                        >
                        </Empty>
                      )
                    }
                  </div>
                </ScrollCard>
                <ScrollCard className="card" hideOverflowX={false}>
                  {
                    currentDirectory.length > 0 ? (
                      <>
                        <Form form={form}>
                          <Row gutter={6}>
                            <Col span={8}>
                              <Form.Item label="用例名称" name="name">
                                <Input placeholder="输入用例名称"/>
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label="创建人" name="create_user">

                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <div style={{float: 'right'}}>
                                <Button
                                  type="primary"
                                  onClick={async () => {
                                    // await listTestcase();
                                  }}
                                >
                                  <SearchOutlined/> 查询
                                </Button>
                                <Button
                                  style={{marginLeft: 8}}
                                  onClick={async () => {
                                    form.resetFields();
                                    // await listTestcase();
                                  }}
                                >
                                  <ReloadOutlined/> 重置
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                        <Row gutter={8} style={{marginTop: 4}}>
                          <Col span={24}>
                            <Dropdown trigger={['click']}>
                              <Button type="primary">
                                <PlusOutlined/> 新建场景
                              </Button>
                            </Dropdown>
                            {selectedRowKeys.length > 0 ? (
                              <Dropdown trigger={['hover']}>
                                <Button
                                  style={{marginLeft: 8}}
                                  icon={<PlayCircleOutlined/>}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  执行用例 <DownOutlined/>
                                </Button>
                              </Dropdown>
                            ) : null}
                            {
                              selectedRowKeys.length > 0 ? (
                                <Button
                                  type="dashed"
                                  style={{marginLeft: 8}}
                                  icon={<ExportOutlined/>}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // onMoveTestCase();
                                  }}
                                >
                                  移动用例
                                </Button>
                              ) : null}
                            {
                              selectedRowKeys.length > 0 ? (
                                <Button
                                  type="dashed"
                                  style={{marginLeft: 8}}
                                  icon={<DeleteOutlined/>}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  删除用例
                                </Button>
                              ) : null}
                          </Col>
                        </Row>
                        <Row style={{marginTop: 16}}>
                          <Col span={24}>
                            <ProTable
                              columns={columns}
                              dataSource={[{'Key': 'No Data'}]}
                            />
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <Empty
                        image={emptyWork}
                        imageStyle={{height: 230}}
                        description="快选中左侧的目录畅享用例之旅吧~"
                      />
                    )
                  }
                </ScrollCard>
              </SplitPane>
            </Row>
          </ProCard>
        )
      }

    </PageContainer>
  )
}

export default TestCaseRecorder;
