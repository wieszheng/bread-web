import React, {useEffect, useState} from 'react';
import './TestCaseDirectory.less';
import {PageContainer, ProCard, ModalForm, ProFormText} from "@ant-design/pro-components";
import {Avatar, Col, Result, Row, Select, Empty, Modal, Tooltip, Menu, message} from "antd";
import SplitPane from "react-split-pane";
import ScrollCard from "@/components/Scrollbar/ScrollCard";
import {PROJECT_AVATAR_URL} from "@/constan";
import {Switch} from '@icon-park/react';
import {getProjects} from "@/services/admin/project";
import SearchTree from "@/components/Tree/SearchTree";
import {ExclamationCircleOutlined, PlusOutlined,EditOutlined,DeleteOutlined} from "@ant-design/icons"
import {
  getListTestcaseDirectory,
  postTestcaseDirectory,
  putTestcaseDirectory
} from "@/services/admin/testcase";
import noRecord from '@/assets/no_record.svg';
import emptyWork from '@/assets/emptyWork.svg';
import {useSetState} from "ahooks";


const {Option} = Select;
type operateType = "add" | "see" | "up";
type ModalType = {
  operateType: operateType;
  currentNode: any | null;
  record: any;
};
const getProjectId = () => {
  const projectId = localStorage.getItem("project_id")
  if (projectId === undefined || projectId === null) {
    return undefined;
  }
  return parseInt(projectId, 10);
}
const TestCaseDirectory: React.FC = () => {

  const [editing, setEditing] = useState(false);
  const [rootModal, setRootModal] = useState<boolean>(false);
  const [project, setProject] = useSetState<any>({
    projects: [],
    project_id: getProjectId()
  });
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    currentNode: null,
    record: {}
  });

  const [directory, setDirectory] = useSetState<any>({
    directoryInfo: [],
    currentDirectory: []
  });
  const fetchProjectData = async () => {
    try {
      const {result} = await getProjects({current: 1, pageSize: 99});

      setProject({projects: result.data, project_id: result.data[0].id});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {

    }
  };
  const fetchDirectoryData = async () => {
    if (project.project_id) {
      const {result} = await getListTestcaseDirectory({project_id: project.project_id});
      setDirectory({directoryInfo: result.data, currentDirectory: result.data?.length > 0 ? [result.data[0].key] : []})
    }

  };
  useEffect(() => {
    fetchProjectData();

  }, []);
  useEffect(() => {
    fetchDirectoryData();

  }, [project.project_id]);

  const handleItemClick = (key: number, node: any) => {
    if (key === 1) {
      // 新增目录
      setModal({
        operateType: 'add',
        currentNode: node.key,
        record: {name: ''},
      })
      setRootModal(true)
    } else if (key === 2) {
      setModal({
        operateType: 'up',
        record: {name: node.title.props.children[2], id: node.key},
      })
      setRootModal(true)
    } else if (key === 3) {
      Modal.confirm({
        title: '你确定要删除这个目录吗?',
        icon: <ExclamationCircleOutlined/>,
        content: '删除后，目录下的case也将不再可见！！！',
        okText: '确定',
        okType: 'danger',
        cancelText: '点错了',
        onOk() {
          // onDeleteDirectory(node.key);
        },
      });
    }
  };
  const getProject = () => {
    if (project.projects.length === 0) {
      return 'loading...';
    }
    const filter_project = project.projects.filter((p: any) => p.id === project.project_id);
    if (filter_project.length === 0) {
      setProject({project_id: project.projects[0].id})
      return project[0];
    }
    return filter_project[0];
  };

  const AddDirectory = (
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
  );
  const content = (node:any) => (
    <Menu>
      <Menu.Item key="1">
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleItemClick(2, node);
          }}
        >
          <EditOutlined/> 编辑目录
        </a>
      </Menu.Item>
      <Menu.Item key="2" danger>
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleItemClick(3, node);
          }}
        >
          <DeleteOutlined/> 删除目录
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <PageContainer
      header={{
        title: '接口用例管理',
        breadcrumb: {},
      }}
    >

      {
        project.projects.length === 0 ? (
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
                onOpenChange={setRootModal}
                onFinish={async (values) => {
                  const params = {
                    name: values.name,
                    project_id:project.project_id,
                    parent: modal.currentNode,
                  };
                  try {
                    console.log(params)
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


                  } catch {
                    // 未通过校验
                  }
                  setRootModal(false);
                  // if (actionRef.current) {
                  //   actionRef?.current?.reload();
                  // }
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
                split="vertical"
                minSize={260}
                defaultSize={300}
                maxSize={800}
              >
                <ScrollCard className="card" hideOverflowX={true}>
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
                              value={project.project_id}
                              autoFocus={true}
                              onChange={(e) => {
                                if (e !== undefined) {
                                  setProject({project_id: e});
                                }
                                setEditing(false);
                              }}
                              filterOption={(input: string, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {project.projects.map((v: any) => (
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
                                src={getProject().avatar || PROJECT_AVATAR_URL}
                              />
                              <span
                                style={{
                                  display: 'inline-block',
                                  marginLeft: 12,
                                  fontWeight: 400,
                                  fontSize: 14,
                                }}
                              >
                              {getProject().name}
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
                      directory.directoryInfo.length > 0 ? (
                        <SearchTree
                          treeData={directory.directoryInfo}
                          menu={content}
                          onSelect={(e: any) => {
                            console.log('onSelect', e)
                          }}
                          addDirectory={AddDirectory}
                          onAddNode={(node: any) => {
                            setModal({
                              currentNode: node.key,
                            })
                            handleItemClick(1, node);
                          }}
                          selectedKeys={directory.currentDirectory}
                        />
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
                <ScrollCard className="card" hideOverflowX={true}>
                  {
                    directory.currentDirectory.length > 0 ? (
                      <div>
                      </div>
                    ) : (
                      <Empty
                        image={emptyWork}
                        imageStyle={{height: 130,marginTop: 100}}
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
};
export default TestCaseDirectory;
