import React, {useEffect, useState} from "react";
import {PageContainer, PageHeader, ProCard} from "@ant-design/pro-components";
import {Avatar} from "antd";
import {PROJECT_AVATAR_URL} from "@/constan";
import {getProject} from "@/services/admin/project";
import {useParams} from "@umijs/max";
import ProjectRole from "@/pages/ApiTest/components/ProjectRole";
import {getUsers} from "@/services/admin/user";
import ProjectInfo from "@/pages/ApiTest/components/ProjectInfo";


const ProjectDetail: React.FC = () => {
  const params: any = useParams();
  const [projectData, setProjectData] = useState<any>({});
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tab, setTab] = useState('tab1');

  const fetchUsers = async () => {
    const {result} = await getUsers({current: 1, pageSize: 99});
    setUsers(result.data);
  };

  const fetchData = async () => {
    try {
      const res = await getProject({project_id: params.id});
      setProjectData(res.result.project);
      setRoles(res.result.roles);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {

    }
  };
  useEffect(() => {
    fetchUsers();
    fetchData();
  }, [projectData, roles]);
  return <PageContainer
    header={{
      title: <PageHeader
        onBack={() => window.history.back()}
        title={<span><Avatar src={projectData.avatar || PROJECT_AVATAR_URL}/></span>}
      />,
      breadcrumb: {},
    }}>
    <ProCard
      tabs={{
        activeKey: tab,
        items: [
          {
            label: `成员列表`,
            key: 'tab1',
            children: <ProjectRole users={users} project={projectData} roles={roles} fetchData={fetchData}/>,
          },
          {
            label: `项目设置`,
            key: 'tab2',
            children: <ProjectInfo users={users} project={projectData} fetchData={fetchData}/>,
          },
        ],
        onChange: (key) => {
          setTab(key);
        },
      }}
    >

    </ProCard>

  </PageContainer>
};
export default ProjectDetail;
