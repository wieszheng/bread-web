import React, {useEffect, useState} from 'react';
import './TestCaseDirectory.less';
import {PageContainer, ProCard} from "@ant-design/pro-components";
import {Avatar, Col, Result, Row, Select, Empty, Modal, Tooltip} from "antd";
import SplitPane from "react-split-pane";
import ScrollCard from "@/components/Scrollbar/ScrollCard";
import {PROJECT_AVATAR_URL} from "@/constan";
import {Switch} from '@icon-park/react';
import {getProjects} from "@/services/admin/project";
import SearchTree from "@/components/Tree/SearchTree";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons"
import {getListTestcaseTree} from "@/services/admin/testcase";
import noRecord from '@/assets/no_record.svg';
import emptyWork from '@/assets/emptyWork.svg';
import {useSetState} from "ahooks";

const {Option} = Select;
const getProjectId = () => {
  const projectId = localStorage.getItem("project_id")
  if (projectId === undefined || projectId === null) {
    return undefined;
  }
  return parseInt(projectId, 10);
}
const TestCaseDirectory: React.FC = () => {
  const [currentNode, setCurrentNode] = useState(null);
  const [rootModal, setRootModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [record, setRecord] = useState({});
  const [modalTitle, setModalTitle] = useState('新建目录');
  const [addCaseVisible, setAddCaseVisible] = useState(false);
  const [project, setProject] = useSetState<any>({
    projects: [],
    project_id: getProjectId()
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
      const {result} = await getListTestcaseTree({project_id: project.project_id});
      setDirectory({directoryInfo: result.data, currentDirectory: result.data?.length > 0 ? [result.data[0].key] : []})
    }

  };
  useEffect(() => {
    fetchProjectData();

  }, []);
  useEffect(() => {
    fetchDirectoryData();

  }, [project.project_id]);

  const handleItemClick = (key, node) => {
    if (key === 1) {
      // 新增目录
      setCurrentNode(node.key);
      setModalTitle('新增目录');
      setRecord({name: ''});
      setRootModal(true);
    } else if (key === 2) {
      setRecord({name: node.title.props.children[2], id: node.key});
      setModalTitle('编辑目录');
      setRootModal(true);
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
          setRootModal(true);
          setRecord({name: ''});
          setModalTitle('新建根目录');
          setCurrentNode(null);
        }}
      >
        <PlusOutlined/>
      </a>
    </Tooltip>
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

                          onSelect={(e: any) => {
                            console.log('onSelect', e)
                          }}
                          addDirectory={AddDirectory}
                          onAddNode={(node: any) => {
                            setCurrentNode(node.key);
                            handleItemClick(1, node);
                          }}
                          handleMenuClick={handleItemClick}
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
                                setRootModal(true);
                                setRecord({name: ''});
                                setModalTitle('新建根目录');
                                setCurrentNode(null);
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
};
export default TestCaseDirectory;
