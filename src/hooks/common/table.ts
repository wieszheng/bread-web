import {Form, TablePaginationConfig} from "antd";
import {useState} from "react";

export function useTable(
  config: any,
  paginationConfig?: Omit<TablePaginationConfig, 'total' | 'current' | 'pageSize' | 'onChange'>
){
  // const isMobile = useAppSelector(getIsMobile);
  const [total, setTotal] = useState<TablePaginationConfig['total']>(0);

  const { apiFn, apiParams, immediate } = config;

  const [form] = Form.useForm();

}
